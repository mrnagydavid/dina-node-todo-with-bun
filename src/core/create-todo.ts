import { z } from 'zod'
import { prisma } from '../gateways/prisma-client'
import { scheduleTodoForDeletion } from './schedule-todo-for-deletion'
import { validate } from '../validate'

export async function createTodo(params: any) {
  const todoParams = validate(todoParamsSchema, params)
  const todo = await createTodoItem(todoParams)

  if (todo.done) {
    await scheduleTodoForDeletion(todo.id)
  }

  return todo
}

async function createTodoItem(todoParams: any) {
  const todo = await prisma().todo.create({ data: todoParams })
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
  priority: z
    .number({
      required_error: 'The priority should be a number between 1 and 5.',
      invalid_type_error: 'The priority should be a number between 1 and 5.',
    })
    .int({ message: 'The priority should be a number between 1 and 5.' })
    .min(1, { message: 'The priority should be a number between 1 and 5.' })
    .max(5, { message: 'The priority should be a number between 1 and 5.' }),
  done: z.boolean().default(false),
})
