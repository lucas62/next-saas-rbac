import { api } from './api-client'

interface CreateProjectRequest {
  name: string
  description: string
}

interface CreateProjectResponse {
  projectId: string
}

export async function createProject(
  organizationSlug: string,
  { name, description }: CreateProjectRequest,
): Promise<CreateProjectResponse> {
  return await api
    .post(`/organizations/${organizationSlug}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<CreateProjectResponse>()
}
