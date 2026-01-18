// web-proyecto/apps/api/src/infrastructure/http/v1.ts
import { Router } from 'express'
import { prisma } from '../prisma/client'
import { authRouter } from './auth.routes'
import { categoryRouter } from './category.routes'
import { tierListRouter } from './tierlist.routes'
import { reactionRouter } from './reaction.routes'
import { feedRouter } from './feed.routes'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() })
})

router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/tierlists', tierListRouter)
router.use('/reactions', reactionRouter)
router.use('/feed', feedRouter)

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } })
  res.json(users)
})
