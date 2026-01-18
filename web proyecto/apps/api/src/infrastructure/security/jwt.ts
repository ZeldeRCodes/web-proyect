// web-proyecto/apps/api/src/infrastructure/security/jwt.ts
import jwt from 'jsonwebtoken'

export function signToken(payload: object, secret: string, expiresIn = '7d'): string {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token: string, secret: string): object | null {
  try {
    return jwt.verify(token, secret) as object
  } catch {
    return null
  }
}
