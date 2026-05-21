import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.uuid(),
                name: z.string(),
                slug: z.string(),
                ownerId: z.uuid(),
                organizationId: z.uuid(),
                description: z.string().nullable(),
                avatarUrl: z.url().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            }),
            401: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            'You are not authorized to see the details of this project',
          )
        }

        const project = await prisma.project.findUnique({
          where: { slug: projectSlug, organizationId: organization.id },
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
            organizationId: true,
            description: true,
            avatarUrl: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        return reply.status(200).send({ project })
      },
    )
}
