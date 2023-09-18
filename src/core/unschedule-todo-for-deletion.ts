import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../gateways/prisma-client'

export async function unscheduleTodoForDeletion(todoId: number) {
  try {
    await prisma().todoScheduledForDeletion.delete({ where: { todo_id: todoId } })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return
    } else {
      throw error
    }
  }
}
