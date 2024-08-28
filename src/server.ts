import { app } from './app'
import { productRoutes } from './routes/products.routes'

app.register(productRoutes, {
  prefix: '/products',
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => console.log('hhtp server is running'))
