'use server'

import ky from 'ky'

const api = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function signInWithEmailAndPassword(
  data: FormData,
): Promise<void> {
  const { email, password } = Object.fromEntries(data)

  try {
    await api
      .post('sessions/password', {
        json: { email, password },
      })
      .json()
  } catch (error) {
    console.error('Error signing in:', error)
  }
}

export async function signInWithGithub() {}

export async function forgotPassword() {}
