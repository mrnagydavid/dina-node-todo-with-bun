import express, { Router } from 'express'
import { getHelloWorld } from './controllers/hello-world-controller'
import { getTodos, postTodo } from './controllers/todo-controller'
import { handleErrors } from './controllers/error-handler'

export function createRouter(): Router {
  const router = express.Router()

  router.get('/', handleErrors(getHelloWorld))
  router.get('/todos', handleErrors(getTodos))
  router.post('/todos', handleErrors(postTodo))

  return router
}
