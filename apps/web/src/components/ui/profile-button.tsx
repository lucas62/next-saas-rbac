import { ChevronDown, LogOut, User } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

export async function ProfileButton() {
  const { user } = await auth()

  const { name, email, avatarUrl } = user || {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div>
          <span className="flex flex-col items-end">{name}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
        <Avatar>
          {avatarUrl && <AvatarImage alt="avatar" src={avatarUrl} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12}>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href="/account" />}
        >
          <User className="mr-2 size-4" />
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<a href="/api/auth/sign-out" />}
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
