import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get profile',
        headers: z.object({
          Authorization: z.string().min(1),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.email(),
              avatarUrl: z.url().nullable(),
            }),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      if (!sub) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: { id: sub },
      })

      if (!user) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      return reply.status(200).send({
        user: user as {
          id: string
          name: string
          email: string
          avatarUrl: string
        },
      })
    },
  )
}
