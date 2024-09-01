import { createProductType } from '@/interfaces/product-types.interface'
import { ProductTypeUseCase } from '@/usecases/product-types.usecase'
import { FastifyInstance } from 'fastify'

export async function productTypeRoutes(app: FastifyInstance) {
  const productTypeUseCase = new ProductTypeUseCase()

  app.post<{ Body: createProductType }>('/types', async (req, reply) => {
    const { name } = req.body

    try {
      const data = await productTypeUseCase.create(name)
      return reply.status(201).send(data)
    } catch (err) {
      reply.status(500).send({ message: err.message })
    }
  })

  app.delete<{ Params: { id: string } }>('/types/:id', async (req, reply) => {
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

  app.get('/', async (req, reply) => {
    try {
      const types = await productTypeUseCase.showTypes()
      return reply.send(types)
    } catch (err) {
      reply.status(500).send({ message: err.message })
    }
  })
}
