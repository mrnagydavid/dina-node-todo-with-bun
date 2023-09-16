import { describe, expect, test } from 'bun:test'
import { listTodos } from '../../src/core/list-todos'
import { createTodo } from '../factories/todo-factory'

describe('listTodos', () => {
  test('should return an empty list when there are no todos', async () => {
    const result = await listTodos({})

    expect(result).toEqual({
      todos: [],
      meta: {
        count: 0,
        page: 1,
        page_size: 10,
      },
    })
  })

  test('should return the saved todos newest first', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ text: `Todo ${i}`, priority: i, done: false })
      todoList.push(todo)
    }

    const result = await listTodos({})

    expect(result).toEqual({
      todos: todoList.reverse(),
      meta: {
        count: 3,
        page: 1,
        page_size: 10,
      },
    })
  })

  test('should return the requested page and size', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ text: `Todo ${i}`, priority: i, done: false })
      todoList.push(todo)
    }

    const result = await listTodos({ page: 2, page_size: 1 })

    expect(result).toEqual({
      todos: [todoList.reverse().at(1)],
      meta: {
        count: 3,
        page: 2,
        page_size: 1,
      },
    })
  })

  test('should return the todos ordered by text asc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ text: `${i}. todo` })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ text: 'asc' }] })

    const texts = result.todos.map((todo) => todo.text)

    expect(texts).toEqual(['1. todo', '2. todo', '3. todo'])
  })

  test('should return the todos ordered by text desc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ text: `${i}. todo` })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ text: 'desc' }] })

    const texts = result.todos.map((todo) => todo.text)

    expect(texts).toEqual(['3. todo', '2. todo', '1. todo'])
  })

  test('should return the todos ordered by priority asc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ priority: i })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ priority: 'asc' }] })

    const priorities = result.todos.map((todo) => todo.priority)

    expect(priorities).toEqual([1, 2, 3])
  })

  test('should return the todos ordered by priority desc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ priority: i })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ priority: 'desc' }] })

    const priorities = result.todos.map((todo) => todo.priority)

    expect(priorities).toEqual([3, 2, 1])
  })

  test('should return the todos ordered by done asc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ done: i % 2 === 0 })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ done: 'asc' }] })

    const dones = result.todos.map((todo) => todo.done)

    expect(dones).toEqual([false, false, true])
  })

  test('should return the todos ordered by done desc', async () => {
    let todoList = []

    for (let i = 1; i <= 3; i++) {
      const todo = await createTodo({ done: i % 2 === 0 })
      todoList.push(todo)
    }

    const result = await listTodos({ order_by: [{ done: 'desc' }] })

    const dones = result.todos.map((todo) => todo.done)

    expect(dones).toEqual([true, false, false])
  })
})
