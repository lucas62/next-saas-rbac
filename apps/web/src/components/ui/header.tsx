import Image from 'next/image'
import logo from 'public/logo.svg'

import { ProfileButton } from './profile-button'

export default function Header() {
  return (
    <div className="max-w[1200px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold">Synkly</h1>
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
