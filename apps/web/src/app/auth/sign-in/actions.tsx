'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
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
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookieStore = await cookies()

    cookieStore.set('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: 'lax',
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
