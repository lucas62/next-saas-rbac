'use server'

import { signInWithPassword } from '@/http/sign-inwith-password'

export async function signInWithEmailAndPassword(
  data: FormData,
): Promise<void> {
  const { email, password } = Object.fromEntries(data)

  try {
    const result = await signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

export async function signInWithGithub() {}

export async function forgotPassword() {}
