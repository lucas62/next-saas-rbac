import { auth } from '@/auth/auth'

export default async function Home() {
  const { user } = await auth()

  return (
    <div>
      <h1>Home</h1>
      <p>{user?.email}</p>
    </div>
  )
}
