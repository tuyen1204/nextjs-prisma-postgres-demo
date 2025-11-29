import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Tạo role trước
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  })

  // Tạo users
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      role: { connect: { id: userRole.id } },
      posts: {
        create: [
          { title: 'Join the Prisma Discord', content: 'https://pris.ly/discord', published: true },
          { title: 'Prisma on YouTube', content: 'https://pris.ly/youtube' },
        ],
      },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@prisma.io',
      role: { connect: { id: adminRole.id } },
      posts: {
        create: [
          { title: 'Follow Prisma on Twitter', content: 'https://www.twitter.com/prisma', published: true },
        ],
      },
    },
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
