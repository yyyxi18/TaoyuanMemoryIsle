import { Request, Response } from 'express'
import { GridFSBucket, ObjectId } from 'mongodb'
import { StoryModel } from '../orm/schemas/storySchemas'

const fields = ['title', 'place', 'area', 'era', 'category', 'excerpt', 'body', 'author', 'visibility', 'published', 'coordinates', 'originalTranscript', 'aiAssisted']
export class StoryController {
  async list(req: Request, res: Response) {
    try {
      const filter: Record<string, unknown> = { published: true, visibility: 'public' }
      for (const key of ['area', 'category', 'era']) if (typeof req.query[key] === 'string' && req.query[key]) filter[key] = req.query[key]
      const stories = await StoryModel.find(filter).sort({ createdAt: -1 }).limit(500).lean()
      const storiesWithAudio = stories.map(story => ({
        ...story,
        audioUrl: story.audio?.fileId ? `/api/v1/stories/${story._id}/audio` : undefined,
      }))
      res.json({ code: 200, message: 'stories', body: storiesWithAudio })
    } catch { res.status(500).json({ code: 500, message: '無法讀取故事' }) }
  }

  async audio(req: Request, res: Response) {
    try {
      const story = await StoryModel.findOne({
        _id: req.params.id,
        published: true,
        visibility: 'public',
      }).lean()
      const fileId = story?.audio?.fileId
      const db = StoryModel.db.db
      if (!fileId) return res.status(404).json({ code: 404, message: '這則故事沒有音檔' })
      if (!db) return res.status(503).json({ code: 503, message: '資料庫尚未連線' })

      const objectId = fileId instanceof ObjectId ? fileId : new ObjectId(String(fileId))
      const bucket = new GridFSBucket(db, { bucketName: 'fs' })
      const [file] = await bucket.find({ _id: objectId }).toArray()
      if (!file) return res.status(404).json({ code: 404, message: '找不到故事音檔' })

      res.setHeader('Content-Type', story.audio?.mimeType || file.contentType || 'application/octet-stream')
      res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(story.audio?.filename || file.filename)}`)
      res.setHeader('Accept-Ranges', 'bytes')
      const range = req.header('range')
      let start = 0
      let end = file.length - 1
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range)
        if (!match || (!match[1] && !match[2])) {
          res.setHeader('Content-Range', `bytes */${file.length}`)
          return res.status(416).end()
        }
        if (!match[1]) {
          const suffixLength = Number(match[2])
          start = Math.max(file.length - suffixLength, 0)
        } else {
          start = Number(match[1])
          if (match[2]) end = Math.min(Number(match[2]), file.length - 1)
        }
        if (start >= file.length || start > end) {
          res.setHeader('Content-Range', `bytes */${file.length}`)
          return res.status(416).end()
        }
        res.status(206)
        res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`)
      }
      res.setHeader('Content-Length', String(end - start + 1))
      const stream = bucket.openDownloadStream(objectId, range ? { start, end: end + 1 } : undefined)
      stream.on('error', () => {
        if (!res.headersSent) res.status(404).json({ code: 404, message: '讀取故事音檔失敗' })
        else res.end()
      })
      stream.pipe(res)
    } catch {
      if (!res.headersSent) res.status(500).json({ code: 500, message: '無法播放故事音檔' })
      else res.end()
    }
  }
  async create(req: Request, res: Response) {
    try {
      const payload: Record<string, unknown> = {}
      for (const field of fields) if (req.body[field] !== undefined) payload[field] = req.body[field]
      for (const required of ['title', 'place', 'area', 'category', 'body']) {
        if (typeof payload[required] !== 'string' || !(payload[required] as string).trim()) return res.status(400).json({ code: 400, message: `缺少必要欄位：${required}` })
      }
      payload.published = payload.visibility === 'public'
      const story = await StoryModel.create(payload)
      res.status(201).json({ code: 201, message: '故事已保存', body: story })
    } catch (error) { res.status(400).json({ code: 400, message: error instanceof Error ? error.message : '投稿失敗' }) }
  }
  async update(req: Request, res: Response) {
    try {
      const patch: Record<string, unknown> = {}
      for (const field of fields) if (req.body[field] !== undefined) patch[field] = req.body[field]
      if (patch.visibility !== undefined) patch.published = patch.visibility === 'public'
      patch.updatedAt = new Date()
      const story = await StoryModel.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true })
      if (!story) return res.status(404).json({ code: 404, message: '找不到故事' })
      res.json({ code: 200, message: '故事已更新', body: story })
    } catch { res.status(400).json({ code: 400, message: '更新故事失敗' }) }
  }
  async remove(req: Request, res: Response) {
    try {
      const story = await StoryModel.findByIdAndDelete(req.params.id)
      if (!story) return res.status(404).json({ code: 404, message: '找不到故事' })
      res.json({ code: 200, message: '故事已刪除' })
    } catch { res.status(400).json({ code: 400, message: '刪除故事失敗' }) }
  }
}
