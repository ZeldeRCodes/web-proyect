// web-proyecto/apps/api/src/application/GetFeed.ts
import { prisma } from '../infrastructure/prisma/client'

export class GetFeed {
  constructor(private userId: string) {}
  async execute() {
    const prefs = await prisma.userPreference.findMany({
      where: { userId: this.userId },
      orderBy: { score: 'desc' },
      take: 5
    })
    const categoryIds = prefs.map(p => p.categoryId)
    const tierLists = await prisma.tierList.findMany({
      where: { published: true, categoryId: { in: categoryIds.length ? categoryIds : undefined } },
      include: { category: true, author: { select: { id: true, name: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return tierLists
  }
}
