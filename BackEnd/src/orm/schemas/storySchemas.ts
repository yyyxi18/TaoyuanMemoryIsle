import { Schema, model } from 'mongoose'

const StorySchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  place: { type: String, required: true, trim: true, maxlength: 160 },
  area: { type: String, required: true, trim: true },
  era: { type: String, default: '' },
  category: { type: String, required: true },
  excerpt: { type: String, default: '', maxlength: 400 },
  body: { type: String, required: true, maxlength: 20000 },
  author: { type: String, default: '匿名投稿者', maxlength: 80 },
  visibility: { type: String, enum: ['public', 'unlisted', 'private'], default: 'public' },
  published: { type: Boolean, default: true },
  coordinates: { type: { lat: Number, lng: Number }, default: undefined },
  audio: {
    fileId: { type: Schema.Types.ObjectId },
    filename: { type: String },
    mimeType: { type: String },
    uploadStatus: { type: String },
  },
  originalTranscript: { type: String, default: '' },
  aiAssisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false })

StorySchema.index({ area: 1, category: 1, era: 1, visibility: 1, published: 1 })
StorySchema.index({ title: 'text', place: 'text', excerpt: 'text', body: 'text' })
export const StoryModel = model('Story', StorySchema)
