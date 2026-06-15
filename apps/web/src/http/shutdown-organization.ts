import { api } from './api-client'

interface ShutdownOrganizationRequest {
  organizationSlug: string
}

export async function shutdownOrganization({
  organizationSlug,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${organizationSlug}`)
}
