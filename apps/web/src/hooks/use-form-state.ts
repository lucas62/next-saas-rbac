import { useState, useTransition } from 'react'

export interface FormState<T = unknown> {
  success: boolean
  message: string | null
  errors: T | null
}

export function useFormState<T = unknown>(
  action: (data: FormData) => Promise<FormState<T>>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState<T>,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<FormState<T>>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      setFormState(result)

      if (result.success && onSuccess) {
        await onSuccess()
      }
    })
  }

  return [formState, handleSubmit, isPending] as const
}
