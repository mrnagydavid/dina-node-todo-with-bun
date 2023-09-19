import { createApp } from './src/app'
import { startTodoMaintenanceApp, stopTodoMaintenanceApp } from './src/todo-maintenance-app'

const app = createApp()

const server = app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})

startTodoMaintenanceApp()

process.on('SIGTERM', () => {
  stopTodoMaintenanceApp()
  server.close()
})
