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
    description,
    quantity,
    typeId,
  }: createProduct): Promise<Product> {
    const result = await this.productRepository.create({
      name,
      price,
      description,
      quantity,
      typeId,
    })

    return result
  }

  async update(id: string, data: Partial<createProduct>): Promise<Product> {
    const updatedProduct = await this.productRepository.Update(id, data)
    return updatedProduct!
  }

  async delete(id: string): Promise<void> {
    const productExist = await this.productRepository.findById(id)

    if (!productExist) {
      throw new Error('Product not found')
    }

    await this.productRepository.Delete(id)
  }

  async searchbyName(name: string): Promise<Product[]> {
    const products = await this.productRepository.sarchByName(name)
    return products
  }

  async searchByCode(code: string): Promise<Product> {
    const product = await this.productRepository.findByCode(code)
    return product!
  }
}

export { ProductUseCase }
