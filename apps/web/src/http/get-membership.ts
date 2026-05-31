import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembership(slug: string) {
  return await api
    .get(`organization/${slug}/membership`)
    .json<GetMembershipResponse>()
}
