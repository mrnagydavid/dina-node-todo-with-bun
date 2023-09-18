import { z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Todo } from '@prisma/client'
import { prisma } from '../gateways/prisma-client'
import { NotFoundError, ValidationError } from '../errors'
import { scheduleTodoForDeletion } from './schedule-todo-for-deletion'
import { unscheduleTodoForDeletion } from './unschedule-todo-for-deletion'

export async function updateTodo(params: any) {
  const validationResult = todoParamsSchema.safeParse(params)

  if (!validationResult.success) {
    const errors = validationResult.error.format()
    throw new ValidationError(errors)
  }

  const todoParams = validationResult.data

  const originalTodo = await prisma().todo.findUnique({ where: { id: todoParams.id } })

  if (originalTodo === null) {
    throw new NotFoundError()
  }

  try {
    await handleAutomaticDeletion(originalTodo, todoParams)
    const todo = prisma().todo.update({ data: todoParams, where: { id: todoParams.id } })
    return todo
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError()
    } else {
      throw error
    }
  }
}

function handleAutomaticDeletion(originalTodo: Todo, todoParams: any) {
  if (originalTodo.done == false && todoParams.done == true) {
    return scheduleTodoForDeletion(todoParams.id)
  } else if (originalTodo.done == true && todoParams.done == false) {
    return unscheduleTodoForDeletion(todoParams.id)
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
  text: z
    .string({
      required_error: 'You must specify the todo text.',
    })
    .trim()
    .min(1, { message: 'The todo text should be at least 1 character long.' })
    .max(255, { message: 'The todo text should not be longer than 255 characters.' }),
  priority: z.coerce
    .number({
      required_error: 'The priority should be a number between 1 and 5.',
      invalid_type_error: 'The priority should be a number between 1 and 5.',
    })
    .int({ message: 'The priority should be a number between 1 and 5.' })
    .min(1, { message: 'The priority should be a number between 1 and 5.' })
    .max(5, { message: 'The priority should be a number between 1 and 5.' }),
  done: z.boolean({
    required_error: 'The "done" field should be defined.',
  }),
})
