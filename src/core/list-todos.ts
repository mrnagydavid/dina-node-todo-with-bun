import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function listTodos(params: any) {
  const query = querySchema.parse(params)

  const todos = await prisma.todo.findMany({
    skip: (query.page - 1) * query.page_size,
    take: query.page_size,
    orderBy: query.order_by,
  })

  const count = await prisma.todo.count()

  const meta = {
    count,
    page: query.page,
    page_size: query.page_size,
  }

  return { todos, meta }
}

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(10),
  order_by: z
    .union([
      z.object({ id: z.enum(['desc', 'asc']) }),
      z.object({ text: z.enum(['desc', 'asc']) }),
      z.object({ priority: z.enum(['desc', 'asc']) }),
      z.object({ done: z.enum(['desc', 'asc']) }),
      z.object({ created_at: z.enum(['desc', 'asc']) }),
      z.object({ updated_at: z.enum(['desc', 'asc']) }),
    ])
    .array()
    .default([{ id: 'desc' }]),
})
