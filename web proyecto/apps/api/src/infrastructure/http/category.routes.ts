// web-proyecto/apps/api/src/infrastructure/http/category.routes.ts
import { Router } from 'express'
import { requireAuth } from './middleware/auth'
import { requireRole } from './middleware/roles'
import { CreateCategory } from '../../application/CreateCategory'
import { ListCategories } from '../../application/ListCategories'

export const categoryRouter = Router()

categoryRouter.get('/', async (_req, res) => {
  const usecase = new ListCategories()
  const result = await usecase.execute()
  res.json(result)
})

categoryRouter.post('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const usecase = new CreateCategory()
    const result = await usecase.execute(req.body)
    res.status(201).json(result)
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})
