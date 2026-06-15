import { ability } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { OrganizationForm } from '../../organization-form'
import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function Settings() {
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShotdownOrganization = permissions?.can('delete', 'Organization')

  return (
    <div className="space-y-4 py-4">
      <header className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your organization settings and preferences.
            </p>
          </div>
        </div>
      </header>
      <main>
        <div className="space-y-4">
          {canUpdateOrganization && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Organization profile</CardTitle>
                  <CardDescription>
                    Manage your organization details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrganizationForm />
                </CardContent>
              </Card>
            </div>
          )}
          {canGetBilling && <div>Billing</div>}

          {canShotdownOrganization && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Shutdown organization</CardTitle>
                  <CardDescription>
                    This will delete all organization date including all
                    projects. You cannot undo this action.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ShutdownOrganizationButton />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
