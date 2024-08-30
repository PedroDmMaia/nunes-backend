import { prisma } from '@/database/prisma-client'
import {
  Product,
  ProductsRepository,
  createProduct,
} from '@/interfaces/product.interface'

class ProductRepositoryPrisma implements ProductsRepository {
  async create(data: createProduct): Promise<Product> {
    const productType = await prisma.productType.findUnique({
      where: {
        id: data.typeId,
      },
    })

    if (!productType) {
      throw new Error('the id product has not exist')
    }

    const code = `${productType.slug}${new Date().getTime()}`

    const result = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        code,
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

  async findById(id: string): Promise<Product | null> {
    const result = await prisma.product.findUnique({
      where: { id },
    })

    return result
  }

  async Update(
    id: string,
    data: Partial<createProduct>,
  ): Promise<Product | null> {
    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return product
  }

  async Delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    })
  }

  async sarchByName(name: string): Promise<Product[]> {
    const product = await prisma.product.findMany({
      where: {
        name: {
          startsWith: name,
          mode: 'insensitive',
        },
      },
    })
    return product
  }
}

export { ProductRepositoryPrisma }
