import { describe, test, expect } from 'bun:test'
import { scheduleTodoForDeletion } from '../../src/core/schedule-todo-for-deletion'
import { unscheduleTodoForDeletion } from '../../src/core/unschedule-todo-for-deletion'
import { createTodo } from '../factories/todo-factory'
import { prisma } from '../../src/gateways/prisma-client'

describe('unscheduleTodoForDeletion', () => {
  test('should unschedule a todo for deletion', async () => {
    const todo = await createTodo()
    await scheduleTodoForDeletion(todo.id)

    await unscheduleTodoForDeletion(todo.id)

    const schedule = await prisma().todoScheduledForDeletion.findFirst()
    expect(schedule).toBe(null)
  })

  test('should handle non-scheduled todos gracefully', async () => {
    const todo = await createTodo()
    await scheduleTodoForDeletion(todo.id)
    await scheduleTodoForDeletion(todo.id + 1)

    await unscheduleTodoForDeletion(todo.id)
    await unscheduleTodoForDeletion(todo.id + 1)
    await unscheduleTodoForDeletion(todo.id + 2)

    const schedule = await prisma().todoScheduledForDeletion.findFirst()
    expect(schedule).toBe(null)
  })
})
