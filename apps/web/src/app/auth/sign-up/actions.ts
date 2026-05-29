'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    email: z.email({ message: 'Please provide a valid e-mail.' }),
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your full name.',
    }),
    password: z
      .string()
      .regex(/[a-zA-Z]/, {
        message: 'Password must contain at least one letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character.',
      })
      .min(6, { message: 'Minimum 6 characters required.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export async function handleSignUp(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }
  const { email, name, password } = result.data

  try {
    await signUp({
      email,
      name,
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
