import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignUpPage() {
  return (
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

      <Separator />

      <Button variant="outline" className="w-full cursor-pointer">
        <Image
          src={githubIcon}
          alt="Github"
          className="mr-2 size-4 dark:invert"
        />
        Sign up with GitHub
      </Button>
    </form>
  )
}
