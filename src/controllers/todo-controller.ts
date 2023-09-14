import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getTodos(req: Request, res: Response) {
  const todos = await prisma.todo.findMany()
  res.json(todos)
}
