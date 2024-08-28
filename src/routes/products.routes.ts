import { createProduct } from '@/interfaces/product.interface'
import { ProductUseCase } from '@/usecases/product.usecase'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function productRoutes(app: FastifyInstance) {
  const productUsecase = new ProductUseCase()
  app.post<{ Body: createProduct }>('/', async (req, reply) => {
    const { name, description, price, quantity, code, typeId } = req.body

    try {
      const data = await productUsecase.create({
        name,
        description,
        price,
        quantity,
        code,
        typeId,
      })

      return reply.send(data)
    } catch (err) {
      reply.send(err)
    }
  })

  app.get('/', (req, reply) => {
    reply.send({ hello: 'world' })
  })
}
