import { TodoScheduledForDeletion } from '@prisma/client'
import { prisma } from '../gateways/prisma-client'

export async function deleteScheduledTodos() {
  const now = new Date()

  const scheduledTodos = await prisma().todoScheduledForDeletion.findMany({
    where: {
      to_be_deleted_at: {
        lte: now,
      },
    },
  })

  for (const scheduledTodo of scheduledTodos) {
    await deleteScheduledTodo(scheduledTodo)
  }
}

async function deleteScheduledTodo(scheduledTodo: TodoScheduledForDeletion) {
  try {
    await prisma().$transaction([
      prisma().todo.delete({ where: { id: scheduledTodo.todo_id } }),
      prisma().todoScheduledForDeletion.delete({ where: { todo_id: scheduledTodo.todo_id } }),
    ])
  } catch (error) {
    return
  }
}
