export interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  code: string
  typeId: number
  createdAt: Date
  updatedAt: Date
}

export interface createProduct {
  name: string
  description: string
  price: number
  quantity: number
  code: string
  typeId: number
}

export interface ProductsRepository {
  create(data: createProduct): Promise<Product>
  findByCode(code: string): Promise<Product | null>
}
