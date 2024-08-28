import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const productTypes = [
    { name: 'Camiseta', slug: 'C' },
    { name: 'Calça', slug: 'K' },
    { name: 'Boné', slug: 'B' },
  ]

  for (const type of productTypes) {
    await prisma.productType.create({
      data: type,
    })
  }

  console.log('Seed data inserted')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
