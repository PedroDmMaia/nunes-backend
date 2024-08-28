import {
  Product,
  ProductsRepository,
  createProduct,
} from '@/interfaces/product.interface'
import { ProductRepositoryPrisma } from '@/repositories/products.respositories'

class ProductUseCase {
  private productRepository: ProductsRepository
  constructor() {
    this.productRepository = new ProductRepositoryPrisma()
  }

  async create({
    name,
    price,
    code,
    description,
    quantity,
    typeId,
  }: createProduct): Promise<Product> {
    const verifyProductExists = await this.productRepository.findByCode(code)

    if (verifyProductExists) {
      throw new Error('Product already exists with the same code')
    }

    const result = await this.productRepository.create({
      name,
      price,
      code,
      description,
      quantity,
      typeId,
    })

    return result
  }
}

export { ProductUseCase }
