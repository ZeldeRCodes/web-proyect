// web-proyecto/apps/api/src/infrastructure/http/middleware/roles.ts
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../prisma/client'

export function requireRole(role: 'ADMIN' | 'USER') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId as string
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
    if (role === 'ADMIN' && user.role !== 'ADMIN') return res.status(403).json({ error: 'FORBIDDEN' })
    next()
  }
}
