import { prisma } from '@/database/prisma-client'
import {
  ProductType,
  ProductTypesRepository,
} from '@/interfaces/product-types.interface'
import { slugify } from '@/utils/slugify'
import { formaterText } from '@/utils/formaterText'

class ProductTypesRepositoryPrisma implements ProductTypesRepository {
  async create(name: string): Promise<ProductType> {
    const slug = slugify(name)
    const foramtedName = formaterText(name)

    const type = await prisma.productType.create({
      data: {
        name: foramtedName,
        slug,
      },
    })

    return type
  }

  async delete(id: number): Promise<void> {
    await prisma.productType.delete({
      where: { id },
    })
  }

  async showTypes(): Promise<ProductType[]> {
    const types = await prisma.productType.findMany()
    return types
  }
}

export { ProductTypesRepositoryPrisma }
