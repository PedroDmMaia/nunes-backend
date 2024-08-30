import { createProduct } from '@/interfaces/product.interface'
import { ProductUseCase } from '@/usecases/product.usecase'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function productRoutes(app: FastifyInstance) {
  const productUsecase = new ProductUseCase()
  app.post<{ Body: createProduct }>('/', async (req, reply) => {
    const { name, description, price, quantity, typeId } = req.body

    try {
      const data = await productUsecase.create({
        name,
        description,
        price,
        quantity,
        typeId,
      })

      return reply.send(data)
    } catch (err) {
      reply.send(err)
    }
  })

  app.put<{ Params: { id: string }; Body: Partial<createProduct> }>(
    '/:id',
    async (req, reply) => {
      const { id } = req.params
      const data = req.body

      try {
        const updatedProduct = await productUsecase.update(id, data)
        return reply.send(updatedProduct)
      } catch (err) {
        reply.send(err)
      }
    },
  )

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const { id } = req.params

    try {
      await productUsecase.delete(id)
      reply.status(204).send()
    } catch (err) {
      reply.status(404).send({ message: err })
    }
  })

  app.get<{ Querystring: { name: string } }>('/search', async (req, reply) => {
    const { name } = req.query

    try {
      const products = await productUsecase.searchbyName(name)
      return reply.send(products)
    } catch (err) {
      reply.status(500).send({ message: err })
    }
  })

  app.get<{ Querystring: { code: string } }>(
    '/search-code',
    async (req, reply) => {
      const { code } = req.query

      try {
        const product = await productUsecase.searchByCode(code)
        return reply.send(product)
      } catch (err) {
        reply.status(500).send({ message: err })
      }
    },
  )
}
