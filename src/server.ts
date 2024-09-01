import { app } from './app'
import { productTypeRoutes } from './routes/product-types.routes'
import { productRoutes } from './routes/products.routes'
import cors from '@fastify/cors'

app.register(cors, {
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
