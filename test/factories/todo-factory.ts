import { Todo } from '@prisma/client'
import { prisma } from '../../src/gateways/prisma-client'
export async function createTodo(params: Partial<Todo> = {}) {
  const result = await prisma().todo.create({
    data: {
      text: params?.text ?? `Todo ${Math.floor(Math.random() * 100)}`,
      priority: params?.priority ?? 1,
      done: params?.done || false,
    },
  })

  return result
}
