import { ability, getCurrentOrg } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()

  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canGetMembers = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current]:text-foreground data-[current]:border-input border border-transparent"
            render={<NavLink href={`/org/${currentOrg}`} />}
          >
            Projects
          </Button>
        )}
        {canGetMembers && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current]:text-foreground data-[current]:border-input border border-transparent"
            render={<NavLink href={`/org/${currentOrg}/members`} />}
          >
            Members
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current]:text-foreground data-[current]:border-input border border-transparent"
            render={<NavLink href={`/org/${currentOrg}/settings`} />}
          >
            Settings & Billing
          </Button>
        )}
      </nav>
    </div>
  )
}
