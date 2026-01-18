// web-proyecto/apps/api/src/application/RegisterUser.ts
import { z } from 'zod'
import { UserRepository } from '../domain/UserRepository'
import { hashPassword } from '../infrastructure/security/hash'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
})

export class RegisterUser {
  constructor(private repo: UserRepository) {}
  async execute(input: unknown) {
    const data = schema.parse(input)
    const exists = await this.repo.findByEmail(data.email)
    if (exists) throw new Error('EMAIL_IN_USE')
    const passwordHash = await hashPassword(data.password)
    const user = await this.repo.create({ email: data.email, name: data.name, passwordHash })
    return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt }
  }
}
