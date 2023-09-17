import { z } from 'zod'
import { prisma } from '../gateways/prisma-client'
import { ValidationError } from '../errors'

export async function createTodo(params: any) {
  const validationResult = todoParamsSchema.safeParse(params)

  if (!validationResult.success) {
    const errors = validationResult.error.format()
    throw new ValidationError(errors)
  }

  const todoParams = validationResult.data

  const todo = prisma().todo.create({ data: todoParams })

  return todo
}

const todoParamsSchema = z.object({
  text: z
    .string({
      required_error: 'You must specify the todo text.',
    })
    .trim()
    .min(1, { message: 'The todo text should be at least 1 character long.' })
    .max(255, { message: 'The todo text should not be longer than 255 characters.' }),
  priority: z.coerce
    .number()
    .min(1, { message: 'The priority should be a number between 1 and 5.' })
    .max(5, { message: 'The priority should be a number between 1 and 5.' }),
  done: z.coerce.boolean().default(false),
})
