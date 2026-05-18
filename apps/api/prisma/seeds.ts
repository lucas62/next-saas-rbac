import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.invite.deleteMany()
  await prisma.member.deleteMany()
  await prisma.project.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.token.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const [user, anotherUser, anotherUser2] =
    await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatarUrl: 'https://github.com/lucas62.png',
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatarGitHub(),
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatarGitHub(),
          passwordHash,
        },
      ],
    })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(2),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser2.id,
              role: 'ADMIN',
            },
          ],
        },
      },
    },
  })
}

seed()
  .then(() => {
    console.log('Seed completed')
  })
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect()
  })
