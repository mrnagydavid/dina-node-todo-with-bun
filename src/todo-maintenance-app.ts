import { deleteScheduledTodos } from './core/delete-scheduled-todos'

let setTimeoutID: NodeJS.Timeout

export function startTodoMaintenanceApp() {
  setTimeoutID = setInterval(async () => {
    await deleteScheduledTodos()
  }, 1000)
  console.log('Todo maintenance process started.')
}

export function stopTodoMaintenanceApp() {
  if (typeof setTimeoutID !== undefined) {
    clearInterval(setTimeoutID)
  }
  console.log('Todo maintenance process stopped.')
}
