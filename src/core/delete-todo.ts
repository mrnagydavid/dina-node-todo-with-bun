import { z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../gateways/prisma-client'
import { NotFoundError } from '../errors'
import { validate } from '../validate'

export async function deleteTodo(params: any) {
  const todoParams = validate(todoParamsSchema, params)
  const todo = await deleteTodoItem(todoParams)
  return todo
}

async function deleteTodoItem(todoParams: any) {
  try {
    const todo = await prisma().todo.delete({ where: { id: todoParams.id } })
    return todo
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
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
