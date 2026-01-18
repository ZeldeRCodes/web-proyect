// web-proyecto/apps/api/src/application/ListCategories.ts
import { prisma } from '../infrastructure/prisma/client'

export class ListCategories {
  async execute() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } })
  }
}
