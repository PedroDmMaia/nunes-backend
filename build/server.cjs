'use strict'
const __create = Object.create
const __defProp = Object.defineProperty
const __getOwnPropDesc = Object.getOwnPropertyDescriptor
const __getOwnPropNames = Object.getOwnPropertyNames
const __getProtoOf = Object.getPrototypeOf
const __hasOwnProp = Object.prototype.hasOwnProperty
const __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (const key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
const __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
)

// src/app.ts
const import_fastify = __toESM(require('fastify'), 1)
const app = (0, import_fastify.default)()

// src/database/prisma-client.ts
const import_client = require('@prisma/client')
const prisma = new import_client.PrismaClient()

// src/utils/slugify.ts
function slugify(text) {
  if (!text) return ''
  return text.substring(0, 3).toUpperCase()
}

// src/utils/formaterText.ts
function formaterText(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// src/repositories/product-types.repository.ts
const ProductTypesRepositoryPrisma = class {
  async create(name) {
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

  async delete(id) {
    await prisma.productType.delete({
      where: { id },
    })
  }

  async showTypes() {
    const types = await prisma.productType.findMany()
    return types
  }
}

// src/usecases/product-types.usecase.ts
const ProductTypeUseCase = class {
  constructor() {
    this.productTypesRepository = new ProductTypesRepositoryPrisma()
  }

  async create(name) {
    const newType = await this.productTypesRepository.create(name)
    return newType
  }

  async delete(id) {
    await this.productTypesRepository.delete(id)
  }

  async showTypes() {
    const types = await this.productTypesRepository.showTypes()
    return types
  }
}

// src/routes/product-types.routes.ts
async function productTypeRoutes(app2) {
  const productTypeUseCase = new ProductTypeUseCase()
  app2.post('/types', async (req, reply) => {
    const { name } = req.body
    try {
      const data = await productTypeUseCase.create(name)
      return reply.status(201).send(data)
    } catch (err) {
      reply.status(500).send({ message: err.message })
    }
  })
  app2.delete('/types/:id', async (req, reply) => {
    const { id } = req.params
    try {
      const numericId = parseInt(id, 10)
      if (isNaN(numericId)) {
        return reply.status(400).send({ message: 'Invalid ID format' })
      }
      await productTypeUseCase.delete(numericId)
      return reply.status(204).send()
    } catch (err) {
      reply.status(500).send({ message: err.message })
    }
  })
  app2.get('/', async (req, reply) => {
    try {
      const types = await productTypeUseCase.showTypes()
      return reply.send(types)
    } catch (err) {
      reply.status(500).send({ message: err.message })
    }
  })
}

// src/repositories/products.respositories.ts
const ProductRepositoryPrisma = class {
  async create(data) {
    const productType = await prisma.productType.findUnique({
      where: {
        id: data.typeId,
      },
    })
    if (!productType) {
      throw new Error('the id product has not exist')
    }
    const code = `${productType.slug}${/* @__PURE__ */ new Date().getTime()}`
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

  async findByCode(code) {
    const result = await prisma.product.findFirst({
      where: {
        code,
      },
    })
    return result || null
  }

  async findById(id) {
    const result = await prisma.product.findUnique({
      where: { id },
    })
    return result
  }

  async Update(id, data) {
    const product = await prisma.product.update({
      where: { id },
      data,
    })
    return product
  }

  async Delete(id) {
    await prisma.product.delete({
      where: { id },
    })
  }

  async sarchByName(name) {
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

  async returnAllProducts() {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    })
    return products
  }
}

// src/usecases/product.usecase.ts
const ProductUseCase = class {
  constructor() {
    this.productRepository = new ProductRepositoryPrisma()
  }

  async create({ name, price, description, quantity, typeId }) {
    const result = await this.productRepository.create({
      name,
      price,
      description,
      quantity,
      typeId,
    })
    return result
  }

  async update(id, data) {
    const updatedProduct = await this.productRepository.Update(id, data)
    return updatedProduct
  }

  async delete(id) {
    const productExist = await this.productRepository.findById(id)
    if (!productExist) {
      throw new Error('Product not found')
    }
    await this.productRepository.Delete(id)
  }

  async searchbyName(name) {
    const products = await this.productRepository.sarchByName(name)
    return products
  }

  async searchByCode(code) {
    const product = await this.productRepository.findByCode(code)
    return product
  }

  async returnAllProducts() {
    const products = await this.productRepository.returnAllProducts()
    return products
  }
}

// src/routes/products.routes.ts
async function productRoutes(app2) {
  const productUsecase = new ProductUseCase()
  app2.post('/', async (req, reply) => {
    const { name, description, price, quantity, typeId } = req.body
    try {
      const data = await productUsecase.create({
        name,
        description,
        price,
        quantity,
        typeId,
      })
      return reply.status(201).send(data)
    } catch (err) {
      reply.status(500).send(err)
    }
  })
  app2.put('/:id', async (req, reply) => {
    const { id } = req.params
    const data = req.body
    try {
      const updatedProduct = await productUsecase.update(id, data)
      return reply.status(200).send(updatedProduct)
    } catch (err) {
      reply.status(500).send(err)
    }
  })
  app2.delete('/:id', async (req, reply) => {
    const { id } = req.params
    try {
      await productUsecase.delete(id)
      return reply.status(204).send()
    } catch (err) {
      reply.status(404).send({ message: err })
    }
  })
  app2.get('/search', async (req, reply) => {
    const { name } = req.query
    try {
      const products = await productUsecase.searchbyName(name)
      return reply.status(200).send(products)
    } catch (err) {
      reply.status(500).send({ message: err })
    }
  })
  app2.get('/search-code', async (req, reply) => {
    const { code } = req.query
    try {
      const product = await productUsecase.searchByCode(code)
      return reply.status(200).send(product)
    } catch (err) {
      reply.status(500).send({ message: err })
    }
  })
  app2.get('/', async (req, reply) => {
    try {
      const products = await productUsecase.returnAllProducts()
      return reply.status(200).send(products)
    } catch (err) {
      reply.status(500).send({ message: err })
    }
  })
}

// src/server.ts
const import_cors = __toESM(require('@fastify/cors'), 1)
app.register(import_cors.default, {
  origin: '*',
})
app.register(productRoutes, {
  prefix: '/products',
})
app.register(productTypeRoutes, {
  prefix: '/product-types',
})
app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => console.log('hhtp server is running'))
