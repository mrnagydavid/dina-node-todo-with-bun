import add from 'date-fns/add'
import { prisma } from '../gateways/prisma-client'
import config from '../config'

export async function scheduleTodoForDeletion(todoId: number) {
  const now = new Date()
  const deleteAfter = add(now, { minutes: config.todo_automatic_deletion_in_mins })

  await prisma().todoScheduledForDeletion.upsert({
    where: { todo_id: todoId },
    update: { to_be_deleted_at: deleteAfter },
    create: { todo_id: todoId, to_be_deleted_at: deleteAfter },
  })
}
