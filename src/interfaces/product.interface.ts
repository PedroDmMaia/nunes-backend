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
  typeId: number
}

export interface ProductsRepository {
  create(data: createProduct): Promise<Product>
  Update(id: string, data: Partial<createProduct>): Promise<Product | null>
  Delete(id: string): Promise<void>
  findByCode(code: string): Promise<Product | null>
  findById(id: string): Promise<Product | null>
  sarchByName(name: string): Promise<Product[]>
}
