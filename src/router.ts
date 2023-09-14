import express, { Router } from 'express'
import { getHelloWorld } from './controllers/hello-world-controller'
import { getTodos } from './controllers/todo-controller'

export function createRouter(): Router {
  const router = express.Router()

  router.get('/', getHelloWorld)
  router.get('/todos', getTodos)

  return router
}
