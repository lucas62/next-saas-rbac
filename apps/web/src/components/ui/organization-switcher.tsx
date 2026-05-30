import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getOrganization } from '@/http/get-organization'
import { getInitials } from '@/utils/get-initials'

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

export async function OrganizationSwitcher() {
  const { organizations } = await getOrganization()

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
          {organizations.map((organization) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={organization.slug}
              render={<Link href={`/org/${organization.slug}`} />}
            >
              <Avatar className="mr-2 size-5">
                {organization.avatarUrl && (
                  <AvatarImage
                    src={organization.avatarUrl}
                    alt={`${organization.slug} avatar`}
                  />
                )}
                <AvatarFallback>
                  {getInitials(organization.name)}
                </AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{organization.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href="/create-organization" />}
        >
          <PlusCircle className="mr-2 size-4" />
          Create new
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
