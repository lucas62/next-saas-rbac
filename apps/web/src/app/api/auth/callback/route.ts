import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code was not provided.' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({ code })

  const cookieStore = await cookies()

  cookieStore.set('token', token, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    sameSite: 'lax',
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
