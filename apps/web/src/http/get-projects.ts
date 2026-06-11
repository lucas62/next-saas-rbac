import { api } from './api-client'

interface GetProjectsResponse {
  projects: Array<{
    id: string
    slug: string
    name: string
    description: string
    organizationId: string
    ownerId: string
    avatarUrl: string | null
    createdAt: string
    owner: {
      id: string
      name: string
      avatarUrl: string | null
    }
  }>
}

export async function getProjects(orgSlug: string) {
  return await api
    .get(`organizations/${orgSlug}/projects`)
    .json<GetProjectsResponse>()
}
