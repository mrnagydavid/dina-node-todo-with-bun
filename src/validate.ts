import { ZodSchema, z } from 'zod'
import { ValidationError } from './errors'

export function validate<T>(schema: ZodSchema, params: any): T {
  const validationResult = schema.safeParse(params)

  if (!validationResult.success) {
    const errors = validationResult.error.format()
    throw new ValidationError(errors)
  }

  return validationResult.data
}
