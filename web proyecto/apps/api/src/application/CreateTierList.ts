// web-proyecto/apps/api/src/application/CreateTierList.ts
import { z } from 'zod'
import { prisma } from '../infrastructure/prisma/client'

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  items: z.array(z.object({ label: z.string().min(1), rank: z.number().int().min(1) }))
})

export class CreateTierList {
  constructor(private authorId: string) {}
  async execute(input: unknown) {
    const data = schema.parse(input)
    const tierList = await prisma.tierList.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: this.authorId,
        categoryId: data.categoryId,
        items: { create: data.items.map(i => ({ label: i.label, rank: i.rank })) }
      },
      include: { items: true }
    })
    return tierList
  }
}
