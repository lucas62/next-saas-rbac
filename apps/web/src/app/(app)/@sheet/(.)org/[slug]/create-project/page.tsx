'use client'

import { useRouter } from 'next/navigation'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import ProjectForm from '../../../../org/[slug]/create-project/project-form'

export default function CreateProject() {
  const router = useRouter()

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back()
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>
            Create a new project to manage your tasks and teams.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
