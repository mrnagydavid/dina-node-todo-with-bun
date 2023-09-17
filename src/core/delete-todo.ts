import { z } from 'zod'
import { prisma } from '../gateways/prisma-client'
import { NotFoundError, ValidationError } from '../errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export async function deleteTodo(params: any) {
  const validationResult = todoParamsSchema.safeParse(params)

  if (!validationResult.success) {
    const errors = validationResult.error.format()
    throw new ValidationError(errors)
  }

  const todoParams = validationResult.data

  try {
    await prisma().todo.delete({ where: { id: todoParams.id } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new NotFoundError()
    } else {
      throw error
    }
  }
}

const todoParamsSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'You must specify the ID of the todo',
      invalid_type_error: 'You must specify the ID of the todo',
    })
    .int({ message: 'You must specify the ID of the todo' })
    .nonnegative({ message: 'You must specify the ID of the todo' }),
})
