import { api } from './api-client'

interface GetOrganizationResponse {
  organizations: Array<{
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }>
}

export async function getOrganization() {
  return await api.get('organizations').json<GetOrganizationResponse>()
}
