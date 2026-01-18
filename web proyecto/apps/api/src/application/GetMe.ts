// web-proyecto/apps/api/src/application/GetMe.ts
import { prisma } from '../infrastructure/prisma/client'

export class GetMe {
  constructor(private userId: string) {}
  async execute() {
    return prisma.user.findUnique({ where: { id: this.userId }, select: { id: true, email: true, name: true, role: true } })
  }
}
