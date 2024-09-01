import {
  ProductType,
  ProductTypesRepository,
} from '@/interfaces/product-types.interface'
import { ProductTypesRepositoryPrisma } from '@/repositories/product-types.repository'

class ProductTypeUseCase {
  private productTypesRepository: ProductTypesRepository

  constructor() {
    this.productTypesRepository = new ProductTypesRepositoryPrisma()
  }

  async create(name: string): Promise<ProductType> {
    const newType = await this.productTypesRepository.create(name)
    return newType
  }

  async delete(id: number): Promise<void> {
    await this.productTypesRepository.delete(id)
  }

  async showTypes(): Promise<ProductType[]> {
    const types = await this.productTypesRepository.showTypes()
    return types
  }
}

export { ProductTypeUseCase }
