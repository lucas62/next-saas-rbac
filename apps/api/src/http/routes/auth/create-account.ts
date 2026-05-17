import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
          email: z.email().min(1),
          password: z.string().min(6),
        }),
      },
    },
    async () => {
      return {
        statusCode: 201,
        body: {
          message: 'Account created successfully',
        },
      }
    }
  )
}
