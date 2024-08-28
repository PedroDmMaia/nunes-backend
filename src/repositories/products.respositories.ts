import { prisma } from '@/database/prisma-client'
import {
  Product,
  ProductsRepository,
  createProduct,
} from '@/interfaces/product.interface'

class ProductRepositoryPrisma implements ProductsRepository {
  async create(data: createProduct): Promise<Product> {
    const result = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        price: data.price,
        quantity: data.quantity,
        typeId: data.typeId,
      },
    })
    return result
  }

  async findByCode(code: string): Promise<Product | null> {
    const result = await prisma.product.findFirst({
      where: {
        code,
      },
    })

    return result || null
  }
}

export { ProductRepositoryPrisma }
