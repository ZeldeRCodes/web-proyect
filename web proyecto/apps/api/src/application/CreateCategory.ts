// web-proyecto/apps/api/src/application/CreateCategory.ts
import { z } from 'zod'
import { prisma } from '../infrastructure/prisma/client'

const schema = z.object({ name: z.string().min(2) })

export class CreateCategory {
  async execute(input: unknown) {
    const data = schema.parse(input)
    const category = await prisma.category.create({ data: { name: data.name } })
    return category
  }
}
