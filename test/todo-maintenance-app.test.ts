import { sleep } from 'bun'
import { describe, test, expect } from 'bun:test'
import add from 'date-fns/add'
import { createTodoScheduledForDeletion } from './factories/todo-scheduled-for-deletion-factory'
import { createTodo } from './factories/todo-factory'
import { startTodoMaintenanceApp, stopTodoMaintenanceApp } from '../src/todo-maintenance-app'
import { prisma } from '../src/gateways/prisma-client'

describe('TodoMaintenanceApp', () => {
  test('should delete scheduled todos', async () => {
    const todoToKeep = await createTodo({})
    const todoToDelete = await createTodo({})
    const toBeDeletedAt = add(new Date(), { minutes: -100 })
    await createTodoScheduledForDeletion({ todo_id: todoToDelete.id, to_be_deleted_at: toBeDeletedAt })

    startTodoMaintenanceApp()
    await sleep(1500)

    const count = await prisma().todo.count()
    expect(count).toBe(1)

    const [loadedTodo] = await prisma().todo.findMany()
    expect(todoToKeep).toEqual(loadedTodo)

    stopTodoMaintenanceApp()
  })
})
