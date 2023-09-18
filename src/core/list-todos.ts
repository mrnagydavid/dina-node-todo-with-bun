import { z } from 'zod'
import { prisma } from '../gateways/prisma-client'
import { validate } from '../validate'

export async function listTodos(params: any) {
  const queryParams = validate(querySchema, params) as QuerySchema
  const todos = await listTodoItems(queryParams)
  const count = await countTodoItems()

  const meta = {
    count,
    page: queryParams.page,
    page_size: queryParams.page_size,
  }

  return { todos, meta }
}

async function listTodoItems(queryParams: QuerySchema) {
  const todos = await prisma().todo.findMany({
    skip: (queryParams.page - 1) * queryParams.page_size,
    take: queryParams.page_size,
    orderBy: queryParams.order_by,
  })

  return todos
}

async function countTodoItems() {
  const count = await prisma().todo.count()
  return count
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

type QuerySchema = ReturnType<typeof querySchema.parse>
