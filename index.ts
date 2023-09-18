import { createApp } from './src/app'
import { startTodoMaintenanceApp, stopTodoMaintenanceApp } from './src/todo-maintenance-app'

const { server } = createApp()

startTodoMaintenanceApp()

process.on('SIGTERM', () => {
  stopTodoMaintenanceApp()
  server.close()
})
