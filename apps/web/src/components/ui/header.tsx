import { Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from 'public/logo.svg'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export default function Header() {
  return (
    <div className="max-w[1200px] mx-auto flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Link className="cursor-pointer" href="/">
          <Image src={logo} alt="logo" className="size-7" />
        </Link>

        <Slash className="text-border size-4 -rotate-[24deg]" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
