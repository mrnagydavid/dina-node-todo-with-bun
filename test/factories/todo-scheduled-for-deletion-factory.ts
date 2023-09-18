import { TodoScheduledForDeletion } from '@prisma/client'
import add from 'date-fns/add'
import { prisma } from '../../src/gateways/prisma-client'

export async function createTodoScheduledForDeletion(params: Partial<TodoScheduledForDeletion> = {}) {
  if (typeof params.todo_id === undefined) {
    throw new Error('todo_id param is missing')
  }

  const result = await prisma().todoScheduledForDeletion.create({
    data: {
      todo_id: params.todo_id as number,
      to_be_deleted_at: params.to_be_deleted_at ?? add(new Date(), { minutes: 1 }),
    },
  })

  return result
}
