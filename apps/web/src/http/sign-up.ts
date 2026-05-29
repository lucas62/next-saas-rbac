import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = void

export async function signUp({
  email,
  name,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('users', { json: { email, name, password } })
}
