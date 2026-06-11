'use client'

import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'

import { handleSaveProject } from './actions'

export default function ProjectForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(handleSaveProject)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {success === true && message && (
        <Alert variant="success">
          <CheckCircle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" id="name" type="text" required />
        {errors?.properties?.name?.errors[0] && (
          <p className="text-sm text-red-500">
            {errors.properties.name.errors[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          className="min-h-32"
          id="description"
          required
        />
        {errors?.properties?.description?.errors[0] && (
          <p className="text-sm text-red-500">
            {errors.properties.description.errors[0]}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
