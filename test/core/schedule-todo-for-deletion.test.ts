import { describe, test, expect } from 'bun:test'
import { scheduleTodoForDeletion } from '../../src/core/schedule-todo-for-deletion'
import { createTodo } from '../factories/todo-factory'
import { prisma } from '../../src/gateways/prisma-client'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import add from 'date-fns/add'
import config from '../../src/config'

describe('scheduleTodoForDeletion', () => {
  test('should schedule a todo for deletion', async () => {
    const todo = await createTodo()

    await scheduleTodoForDeletion(todo.id)

    const schedule = await prisma().todoScheduledForDeletion.findFirst()
    if (schedule == null) {
      throw new Error()
    }

    expect(schedule.todo_id).toBe(todo.id)

    const toBeDeletedAt = add(new Date(), { minutes: config.todo_automatic_deletion_in_mins })
    const difference = Math.abs(differenceInSeconds(schedule?.to_be_deleted_at, toBeDeletedAt))
    expect(difference).toBeLessThanOrEqual(5)
  })

  test('should schedule a non-existing todo for deletion too', async () => {
    await scheduleTodoForDeletion(1)

    const schedule = await prisma().todoScheduledForDeletion.findFirst()

    expect(schedule?.todo_id).toBe(1)
  })
})
