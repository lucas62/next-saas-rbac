'use client'

import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary hover:bg-muted flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        <span className="text-muted-foreground">Select Organization</span>
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuItem>
            <Avatar className="mr-2 size-5">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt={`avatar-1`}
              />
              <AvatarFallback>O1</AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">Organization 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Avatar className="mr-2 size-4">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt={`avatar-2`}
              />
              <AvatarFallback>O2</AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">Organization 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Avatar className="mr-2 size-4">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt={`avatar-3`}
              />
              <AvatarFallback>O3</AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">Organization 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/create-organization" />}>
          <PlusCircle className="mr-2 size-4" />
          Create new
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
