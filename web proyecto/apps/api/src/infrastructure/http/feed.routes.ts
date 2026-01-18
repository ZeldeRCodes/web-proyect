// web-proyecto/apps/api/src/infrastructure/http/feed.routes.ts
import { Router } from 'express'
import { requireAuth } from './middleware/auth'
import { GetFeed } from '../../application/GetFeed'
import { GetMe } from '../../application/GetMe'

export const feedRouter = Router()

feedRouter.get('/me', requireAuth, async (req, res) => {
  const usecase = new GetMe((req as any).userId)
  const result = await usecase.execute()
  res.json(result)
})

feedRouter.get('/recommended', requireAuth, async (req, res) => {
  const usecase = new GetFeed((req as any).userId)
  const result = await usecase.execute()
  res.json(result)
})
