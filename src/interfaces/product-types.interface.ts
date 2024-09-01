export interface ProductType {
  id: number
  name: string
  slug: string
}

export interface createProductType {
  name: string
}

export interface ProductTypesRepository {
  create(name: string): Promise<ProductType>
  delete(id: number): Promise<void>
  showTypes(): Promise<ProductType[]>
}
