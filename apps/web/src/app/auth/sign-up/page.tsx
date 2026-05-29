'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGithub } from '../actions'

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition()

  function handleSignInWithGithub() {
    startTransition(async () => {
      await signInWithGithub()
    })
  }

  return (
    <div className="space-y-4">
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" id="email" type="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            id="password_confirmation"
            type="password"
            required
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Create account
        </Button>

        <Button
          variant="link"
          className="w-full cursor-pointer"
          size="sm"
          render={<Link href="/auth/sign-in" />}
        >
          Already have an account? Sign in
        </Button>
      </form>

      <Separator />

      <Button
        onClick={handleSignInWithGithub}
        variant="outline"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
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
    </div>
  )
}
