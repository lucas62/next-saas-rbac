'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z.email({ message: 'Please provide a valid e-mail.' }),
  password: z.string().min(1, { message: 'Please provide a password.' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }
  const { email, password } = result.data

  try {
    await signInWithPassword({
      email,
      password,
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
  return { success: true, message: null, errors: null }
}

export async function signInWithGithub() {}

export async function forgotPassword() {}
