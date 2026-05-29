'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState } from 'react'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const [{ success, message, errors }, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    {
      success: false,
      message: null,
      errors: null,
    },
  )

  return (
    <form action={formAction} className="space-y-4" noValidate>
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

        {errors?.email && (
          <p className="text-sm text-red-500">{errors.email.join(', ')}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" id="password" type="password" required />

        {errors?.password && (
          <p className="text-sm text-red-500">{errors.password.join(', ')}</p>
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

      <Button
        disabled={isPending}
        variant="outline"
        className="w-full cursor-pointer"
      >
        <Image
          src={githubIcon}
          alt="Github"
          className="mr-2 size-4 dark:invert"
        />
        Sign in with GitHub
      </Button>
    </form>
  )
}
