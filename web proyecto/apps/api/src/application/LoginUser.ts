// web-proyecto/apps/api/src/application/LoginUser.ts
import { z } from 'zod'
import { UserRepository } from '../domain/UserRepository'
import { verifyPassword } from '../infrastructure/security/hash'
import { signToken } from '../infrastructure/security/jwt'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export class LoginUser {
  constructor(private repo: UserRepository, private jwtSecret: string) {}
  async execute(input: unknown) {
    const data = schema.parse(input)
    const user = await this.repo.findByEmail(data.email)
    if (!user) throw new Error('INVALID_CREDENTIALS')
    const ok = await verifyPassword(data.password, user.passwordHash)
    if (!ok) throw new Error('INVALID_CREDENTIALS')
    const token = signToken({ sub: user.id }, this.jwtSecret)
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }
}
