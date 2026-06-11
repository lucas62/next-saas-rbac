import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrg, getCurrentProject } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getProjects } from '@/http/get-projects'
import { getInitials } from '@/utils/get-initials'

export async function ProjectSwitcher() {
  const currentOrg = await getCurrentOrg()

  if (!currentOrg) return null

  const { projects } = await getProjects(currentOrg)
  const currentProjectSlug = await getCurrentProject()

  const currentProject = projects.find(
    (project) => project.slug === currentProjectSlug,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary hover:bg-muted flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {!currentProject ? (
          <span className="text-muted-foreground truncate text-left">
            Select Project
          </span>
        ) : (
          <>
            <Avatar className="size-4">
              {currentProject.avatarUrl && (
                <AvatarImage
                  src={currentProject.avatarUrl}
                  alt={`${currentProject.slug} avatar`}
                />
              )}
              <AvatarFallback>
                {getInitials(currentProject.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-left">{currentProject.name}</span>
          </>
        )}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {projects.map((project) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={project.id}
              render={
                <Link href={`/org/${currentOrg}/project/${project.slug}`} />
              }
            >
              <Avatar className="mr-2 size-4">
                {project.avatarUrl && (
                  <AvatarImage
                    src={project.avatarUrl}
                    alt={`${project.slug} avatar`}
                  />
                )}
                <AvatarFallback>{getInitials(project.name)}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{project.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/org/${currentOrg}/create-project`} />}
        >
          <PlusCircle className="mr-2 size-4" />
          Create new
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
