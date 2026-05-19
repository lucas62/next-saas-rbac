import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string(),

    JWT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string(),
    NEXT_PUBLIC_JWT_SECRET: z.string(),
  },
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
})
