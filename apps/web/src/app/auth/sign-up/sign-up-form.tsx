'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithGithub } from '../actions'
import { handleSignUp } from './actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    handleSignUp,
    () => {
      router.push('/auth/sign-in')
    },
  )

  const [isGithubPending, startGithubTransition] = useTransition()

  function handleSignInWithGithub() {
    startGithubTransition(async () => {
      await signInWithGithub()
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {success === false && message && (
          <Alert>
            <AlertTriangle />
            <AlertTitle>Sign up failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" type="text" required />
          {errors?.properties?.name?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.name.errors[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" id="email" type="email" required />
          {errors?.properties?.email?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.email.errors[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required />
          {errors?.properties?.password?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.password.errors[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            id="password_confirmation"
            type="password"
            required
          />
          {errors?.properties?.password_confirmation?.errors[0] && (
            <p className="text-sm text-red-500">
              {errors.properties.password_confirmation.errors[0]}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending || isGithubPending}
        >
          {isPending || isGithubPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button
          variant="link"
          className="w-full cursor-pointer"
          size="sm"
          disabled={isPending || isGithubPending}
          render={<Link href="/auth/sign-in" />}
        >
          Already have an account? Sign in
        </Button>
      </form>

      <Separator />

      <form action={handleSignInWithGithub}>
        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
          disabled={isPending || isGithubPending}
        >
          {isGithubPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Image
              src="/github-icon.svg"
              width={16}
              height={16}
              alt="Github"
              className="mr-2 size-4 dark:invert"
            />
          )}
          Sign up with GitHub
        </Button>
      </form>
    </div>
  )
}
