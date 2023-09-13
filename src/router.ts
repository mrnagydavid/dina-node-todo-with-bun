import express, { Router } from 'express'
import { getHelloWorld } from './controllers/hello-world-controller'

export function createRouter(): Router {
  const router = express.Router()

  router.get('/', getHelloWorld)

  return router
}
