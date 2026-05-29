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
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  // exemplo de uso useActionState, caso queira o uso do reset de form utilizar ele
  // const [{ success, message, errors }, formAction, isPending] = useActionState(
  //   signInWithEmailAndPassword,
  //   {
  //     success: false,
  //     message: null,
  //     errors: null,
  //   },
  // )

  const router = useRouter()
  const [isGithubPending, startGithubTransition] = useTransition()

  function handleSignInWithGithub() {
    startGithubTransition(async () => {
      await signInWithGithub()
    })
  }

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    async () => {
      await router.push('/')
    },
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" id="email" type="email" required />

          {errors?.properties?.email?.errors && (
            <p className="text-sm text-red-500">
              {errors.properties.email.errors.join(', ')}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required />

          {errors?.properties?.password?.errors && (
            <p className="text-sm text-red-500">
              {errors.properties.password.errors.join(', ')}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-muted-foreground cursor-pointer text-xs font-medium hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
            </>
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button
          disabled={isPending}
          variant="link"
          className="w-full cursor-pointer"
          size="sm"
          render={<Link href="/auth/sign-up" />}
        >
          Create new account
        </Button>

        <Separator />
      </form>

      <Button
        onClick={handleSignInWithGithub}
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
        Sign in with GitHub
      </Button>
    </div>
  )
}
