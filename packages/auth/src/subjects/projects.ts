import { z } from 'zod'

export const projectSubjectSchema = z.tuple([
  z.union([z.literal('create'), z.literal('delete'), z.literal('manage')]),
  z.literal('Project'),
])

export type ProjectSubject = z.infer<typeof projectSubjectSchema>
