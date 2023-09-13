import express from 'express'
import { createRouter } from './router'

export function createApp(port = 3000) {
  const app = express()

  app.use('/', createRouter())

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  return app
}
