import { api } from './api-client'

interface CreateProjectRequest {
  orgSlug: string
  name: string
  description: string
}

interface CreateProjectResponse {
  projectId: string
}

export async function createProject({
  orgSlug,
  name,
  description,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  return await api
    .post(`/organizations/${orgSlug}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<CreateProjectResponse>()
}
