// web-proyecto/apps/api/src/infrastructure/http/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../security/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const token = header.replace('Bearer ', '')
  const payload = verifyToken(token, process.env.JWT_SECRET as string)
  if (!payload || typeof payload !== 'object' || !('sub' in payload)) return res.status(401).json({ error: 'UNAUTHORIZED' })
  ;(req as any).userId = (payload as any).sub
  next()
}
