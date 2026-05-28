'use server'

import ky from 'ky'

const api = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function signInWithEmailAndPassword(data: FormData) {
  await api.post('auth/login', {
    json: Object.fromEntries(data),
  })
}

export async function signInWithGithub() {}

export async function forgotPassword() {}
