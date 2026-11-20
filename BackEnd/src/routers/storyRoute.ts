import { Router } from 'express'
import { StoryController } from '../controller/StoryController'

const router = Router()
const controller = new StoryController()
router.get('/api/v1/stories', (req, res) => controller.list(req, res))
router.get('/api/v1/stories/:id/audio', (req, res) => controller.audio(req, res))
router.post('/api/v1/stories', (req, res) => controller.create(req, res))
router.patch('/api/v1/stories/:id', (req, res) => controller.update(req, res))
router.delete('/api/v1/stories/:id', (req, res) => controller.remove(req, res))
export default router
