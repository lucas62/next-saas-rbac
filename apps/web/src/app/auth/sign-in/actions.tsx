'use server'

export async function signInWithEmailAndPassword(data: FormData) {
  console.log(Object.fromEntries(data))
}

export async function signInWithGithub() {}

export async function forgotPassword() {}
