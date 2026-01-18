// web-proyecto/apps/api/src/application/PublishTierList.ts
import { prisma } from '../infrastructure/prisma/client'

export class PublishTierList {
  constructor(private authorId: string) {}
  async execute(id: string) {
    const tl = await prisma.tierList.findUnique({ where: { id }, select: { authorId: true } })
    if (!tl || tl.authorId !== this.authorId) throw new Error('FORBIDDEN')
    return prisma.tierList.update({ where: { id }, data: { published: true } })
  }
}
