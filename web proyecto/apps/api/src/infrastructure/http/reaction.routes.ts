// web-proyecto/apps/api/src/infrastructure/http/reaction.routes.ts
import { Router } from 'express'
import { requireAuth } from './middleware/auth'
import { ReactTierList } from '../../application/ReactTierList'

export const reactionRouter = Router()

reactionRouter.post('/', requireAuth, async (req, res) => {
  try {
    const usecase = new ReactTierList((req as any).userId)
    const result = await usecase.execute(req.body)
    res.status(201).json(result)
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})
