// web-proyecto/apps/api/src/application/ReactTierList.ts
import { z } from 'zod'
import { prisma } from '../infrastructure/prisma/client'

const schema = z.object({ tierListId: z.string().uuid(), type: z.enum(['LIKE', 'DISLIKE']) })

export class ReactTierList {
  constructor(private userId: string) {}
  async execute(input: unknown) {
    const data = schema.parse(input)
    const reaction = await prisma.reaction.upsert({
      where: { userId_tierListId: { userId: this.userId, tierListId: data.tierListId } },
      update: { type: data.type },
      create: { userId: this.userId, tierListId: data.tierListId, type: data.type }
    })
    const tl = await prisma.tierList.findUnique({ where: { id: data.tierListId }, select: { categoryId: true } })
    if (tl) {
      const delta = data.type === 'LIKE' ? 1 : -1
      await prisma.userPreference.upsert({
        where: { userId_categoryId: { userId: this.userId, categoryId: tl.categoryId } },
        update: { score: { increment: delta } },
        create: { userId: this.userId, categoryId: tl.categoryId, score: delta }
      })
    }
    return reaction
  }
}
