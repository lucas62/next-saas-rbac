import { Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from 'public/logo.svg'
import { Suspense } from 'react'

import { ability } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export default async function Header() {
  const permissions = await ability()

  return (
    <div className="max-w[1200px] mx-auto flex items-center justify-between border-b px-4 pb-2">
      <div className="flex items-center gap-2">
        <Link className="cursor-pointer" href="/">
          <Image src={logo} alt="logo" className="size-7" />
        </Link>

        <Slash className="text-border size-4 -rotate-[24deg]" />

        <Suspense
          fallback={
            <div className="bg-muted h-7 w-[168px] animate-pulse rounded" />
          }
        >
          <OrganizationSwitcher />
        </Suspense>

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="text-border size-4 -rotate-[24deg]" />
            <Suspense
              fallback={
                <div className="bg-muted h-7 w-[168px] animate-pulse rounded" />
              }
            >
              <ProjectSwitcher />
            </Suspense>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
        <ProfileButton />
      </div>
    </div>
  )
}
