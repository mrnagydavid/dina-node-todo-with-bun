import { z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Todo } from '@prisma/client'
import { prisma } from '../gateways/prisma-client'
import { NotFoundError } from '../errors'
import { scheduleTodoForDeletion } from './schedule-todo-for-deletion'
import { unscheduleTodoForDeletion } from './unschedule-todo-for-deletion'
import { validate } from '../validate'

export async function updateTodo(params: any) {
  const todoParams = validate(todoParamsSchema, params)
  const originalTodo = await getOriginalTodo(todoParams)
  const todo = await updateTodoItem(originalTodo, todoParams)
  return todo
}

async function getOriginalTodo(todoParams: any) {
  const originalTodo = await prisma().todo.findUnique({ where: { id: todoParams.id } })

  if (originalTodo === null) {
    throw new NotFoundError()
  }

  return originalTodo
}

async function updateTodoItem(originalTodo: Todo, todoParams: any) {
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
