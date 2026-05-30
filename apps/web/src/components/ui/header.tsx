import { Slash } from 'lucide-react'
import Image from 'next/image'
import logo from 'public/logo.svg'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export default function Header() {
  return (
    <div className="max-w[1200px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Image src={logo} alt="logo" width={150} height={150} />

        <Slash className="text-border size-4 -rotate-[24deg]" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
