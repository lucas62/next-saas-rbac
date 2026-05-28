'use server'

import { signInWithPassword } from '@/http/sign-inwith-password'

export async function signInWithEmailAndPassword(
  previousState: unknown,
  data: FormData,
) {
  const { email, password } = Object.fromEntries(data)

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 2000)
  })

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
