'use client'

import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

// import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { handleSaveOrganization } from '../create-organization/actions'

export function OrganizationForm() {
  // const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    handleSaveOrganization,
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {success === false && message && (
          <Alert className="mt-4" variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Save organization failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {success === true && message && (
          <Alert className="mt-4" variant="success">
            <CheckCircle className="size-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Organization name</Label>
          <Input name="name" id="name" type="text" required />
          {errors?.properties?.name?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.name.errors[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="domain">E-mail domain</Label>
          <Input
            inputMode="url"
            placeholder="example.com"
            name="domain"
            id="domain"
            type="text"
          />
          {errors?.properties?.domain?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.domain.errors[0]}
            </p>
          )}
        </div>
        <div className="cursor-pointer space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              className="translate-y-0.5"
            />
            <label className="space-y-1" htmlFor="shouldAttachUsersByDomain">
              <div className="text-sm leading-none font-medium">
                Auto-join new members
              </div>
              <p className="text-muted-foreground text-sm">
                This will automatically invite all members with the same e-mail
                domain as the organization.
              </p>
            </label>
          </div>
        </div>
        {errors?.properties?.shouldAttachUsersByDomain?.errors[0] && (
          <p className="text-sm text-red-500">
            {errors.properties.shouldAttachUsersByDomain.errors[0]}
          </p>
        )}

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            'Save organization'
          )}
        </Button>
      </form>
    </div>
  )
}
