'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject as createProjectHTTP } from '@/http/create-project'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters.' }),
  description: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters.' }),
})

export async function handleSaveProject(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const currentOrg = await getCurrentOrg()

  if (!currentOrg)
    return { success: false, message: 'Organization not found', errors: null }

  const { name, description } = result.data

  try {
    await createProjectHTTP({
      orgSlug: currentOrg,
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.data
      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, please try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created project',
    errors: null,
  }
}
