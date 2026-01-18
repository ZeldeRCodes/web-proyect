// web-proyecto/apps/api/src/infrastructure/http/tierlist.routes.ts
import { Router } from 'express'
import { requireAuth } from './middleware/auth'
import { CreateTierList } from '../../application/CreateTierList'
import { PublishTierList } from '../../application/PublishTierList'
import { prisma } from '../prisma/client'

export const tierListRouter = Router()

tierListRouter.get('/', async (_req, res) => {
  const data = await prisma.tierList.findMany({
    where: { published: true },
    include: { category: true, author: { select: { id: true, name: true } }, items: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json(data)
})

tierListRouter.get('/:id', async (req, res) => {
  const data = await prisma.tierList.findUnique({
    where: { id: req.params.id },
    include: { category: true, author: { select: { id: true, name: true } }, items: true }
  })
  if (!data || !data.published) return res.status(404).json({ error: 'NOT_FOUND' })
  res.json(data)
})

tierListRouter.post('/', requireAuth, async (req, res) => {
  try {
    const usecase = new CreateTierList((req as any).userId)
    const result = await usecase.execute(req.body)
    res.status(201).json(result)
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})

tierListRouter.post('/:id/publish', requireAuth, async (req, res) => {
  try {
    const usecase = new PublishTierList((req as any).userId)
    const result = await usecase.execute(req.params.id)
    res.json(result)
  } catch (e) {
    if (e instanceof Error && e.message === 'FORBIDDEN') return res.status(403).json({ error: 'FORBIDDEN' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})
