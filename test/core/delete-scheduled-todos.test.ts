import { describe, test, expect } from 'bun:test'
import add from 'date-fns/add'
import { prisma } from '../../src/gateways/prisma-client'
import { deleteScheduledTodos } from '../../src/core/delete-scheduled-todos'
import { createTodo } from '../factories/todo-factory'
import { createTodoScheduledForDeletion } from '../factories/todo-scheduled-for-deletion-factory'

describe('deleteScheduledTodos', () => {
  test('should delete todos marked for deletion', async () => {
    const todo1 = await createTodo({})
    const todo2 = await createTodo({})
    const todo3 = await createTodo({})

    const long_ago = add(new Date(), { minutes: -100 })
    await createTodoScheduledForDeletion({ todo_id: todo1.id, to_be_deleted_at: long_ago })
    await createTodoScheduledForDeletion({ todo_id: todo3.id, to_be_deleted_at: long_ago })

    await deleteScheduledTodos()

    const count = await prisma().todo.count()
    const [todo] = await prisma().todo.findMany()
    expect(count).toBe(1)
    expect(todo).toEqual(todo2)
  })

  test('should handle already missing todos gracefully', async () => {
    const todo1 = await createTodo({})
    const todo2 = await createTodo({})

    const long_ago = add(new Date(), { minutes: -100 })
    await createTodoScheduledForDeletion({ todo_id: todo1.id, to_be_deleted_at: long_ago })
    await createTodoScheduledForDeletion({ todo_id: todo2.id + 1, to_be_deleted_at: long_ago })

    await deleteScheduledTodos()

    const count = await prisma().todo.count()
    const [todo] = await prisma().todo.findMany()
    expect(count).toBe(1)
    expect(todo).toEqual(todo2)
  })
})
