'use client'

import { useRouter } from 'next/navigation'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { OrganizationForm } from '../../org/organization-form'

export default function CreateOrganization() {
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
          <SheetTitle>Create Organization</SheetTitle>
          <SheetDescription>
            Create a new organization to manage your projects and teams.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
