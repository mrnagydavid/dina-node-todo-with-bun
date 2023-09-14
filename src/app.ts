import express from 'express'
import { createRouter } from './router'
import { PrismaClient } from '@prisma/client'

export function createApp(port = 3000) {
  const app = express()
  const prisma = new PrismaClient()

  app.use('/', createRouter())

  app.get('/todo', async (req, res) => {
    const todo = await prisma.todo.create({
      data: {
        text: 'hello',
        priority: 1,
        done: false,
      },
    })
    res.json(todo)
  })

  app.get('/todos', async (req, res) => {
    const todos = await prisma.todo.findMany()
    res.json(todos)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  return app
}
