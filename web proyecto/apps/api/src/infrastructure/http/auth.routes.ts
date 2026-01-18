// web-proyecto/apps/api/src/infrastructure/http/auth.routes.ts
import { Router } from 'express'
import { PrismaUserRepository } from '../repositories/PrismaUserRepository'
import { RegisterUser } from '../../application/RegisterUser'
import { LoginUser } from '../../application/LoginUser'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
  try {
    const repo = new PrismaUserRepository()
    const usecase = new RegisterUser(repo)
    const result = await usecase.execute(req.body)
    res.status(201).json(result)
  } catch (e) {
    if (e instanceof Error && e.message === 'EMAIL_IN_USE') return res.status(409).json({ error: 'EMAIL_IN_USE' })
    if (e instanceof Error && e.name === 'ZodError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const repo = new PrismaUserRepository()
    const usecase = new LoginUser(repo, process.env.JWT_SECRET as string)
    const result = await usecase.execute(req.body)
    res.json(result)
  } catch (e) {
    if (e instanceof Error && e.message === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'INVALID_CREDENTIALS' })
    if (e instanceof Error && e.name === 'ZodError') return res.status(400).json({ error: 'INVALID_INPUT' })
    res.status(500).json({ error: 'SERVER_ERROR' })
  }
})
