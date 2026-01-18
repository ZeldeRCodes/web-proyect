// web-proyecto/apps/api/src/infrastructure/repositories/PrismaUserRepository.ts
import { prisma } from '../prisma/client'
import { UserRepository } from '../../domain/UserRepository'
import { User } from '../../domain/User'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } }) as unknown as User | null
  }
  async create(data: { email: string; name: string; passwordHash: string; role?: 'ADMIN' | 'USER' }): Promise<User> {
    return prisma.user.create({ data }) as unknown as User
  }
}
