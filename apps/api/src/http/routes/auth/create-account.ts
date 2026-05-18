import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create a new user',
        description:
          'Create a new user with the given name, email, and password',
        tags: ['auth'],
        body: z.object({
          name: z.string().min(1),
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            message: z.string({
              message: 'User created successfully',
            }),
          }),
          400: z.object({
            message: z.string({
              message: 'User with same email already exists',
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        return reply.status(400).send({
          message: 'User with same email already exists',
        })
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: { name, email, passwordHash },
      })

      return reply.status(201).send({ message: 'User created successfully' })
    },
  )
}
