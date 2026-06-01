import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

interface CreateOrganizationResponse {
  organizationId: string
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  return await api
    .post('organization', {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<CreateOrganizationResponse>()
}
