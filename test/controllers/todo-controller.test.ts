import { describe, test, expect, beforeEach } from 'bun:test'
import supertest from 'supertest'
import { Todo } from '@prisma/client'
import { createApp } from '../../src/app'
import { createTodo } from '../factories/todo-factory'

const app = createApp()

describe('GET /todos', () => {
  test('should list the todos', async () => {
    const todo1 = await createTodo()
    const todo2 = await createTodo()

    // prettier-ignore
    const result = await supertest(app)
      .get('/todos')
      .expect(200)

    expect(result.body).toEqual({
      success: true,
      data: {
        todos: [
          {
            id: todo2.id,
            text: todo2.text,
            priority: todo2.priority,
            done: todo2.done,
            created_at: todo2.created_at?.toISOString(),
            updated_at: todo2.updated_at?.toISOString(),
          },
          {
            id: todo1.id,
            text: todo1.text,
            priority: todo1.priority,
            done: todo1.done,
            created_at: todo1.created_at?.toISOString(),
            updated_at: todo1.updated_at?.toISOString(),
          },
        ],
        meta: {
          count: 2,
          page: 1,
          page_size: 10,
        },
      },
    })
  })

  test('should pass on the query params', async () => {
    const todoParams = [{ text: 'C' }, { text: 'B' }, { text: 'A' }]

    for (const params of todoParams) {
      await createTodo(params)
    }

    // prettier-ignore
    const result = await supertest(app)
      .get('/todos?order_by[][text]=asc')
      .expect(200)

    const texts = result.body.data.todos.map((todo: any) => todo.text)
    expect(texts).toEqual(['A', 'B', 'C'])
  })
})

describe('POST /todos', () => {
  test('should create a new todo', async () => {
    // prettier-ignore
    const result = await supertest(app)
      .post('/todos')
      .send({ text: 'Test todo', priority: 3, done: false })
      .expect(200)

    expect(result.body.success).toBe(true)
    expect(result.body.data.text).toBe('Test todo')
    expect(result.body.data.priority).toBe(3)
    expect(result.body.data.done).toBe(false)
  })

  test('should return errors', async () => {
    // prettier-ignore
    const result = await supertest(app)
      .post('/todos')
      .send({ priority: 3, done: false })
      .expect(400)

    expect(result.body.success).toBe(false)
    expect(result.body.errors.text._errors).toEqual(['You must specify the todo text.'])
  })
})

describe('PUT /todos', () => {
  let originalTodo: Todo

  beforeEach(async () => {
    originalTodo = await createTodo({ text: 'Foobar', priority: 5, done: false })
  })

  test('should update an existing todo', async () => {
    const result = await supertest(app)
      .put(`/todos/${originalTodo.id}`)
      .send({ text: 'Test todo', priority: 3, done: false })
      .expect(200)

    expect(result.body.success).toBe(true)
    expect(result.body.data.text).toBe('Test todo')
    expect(result.body.data.priority).toBe(3)
    expect(result.body.data.done).toBe(false)
  })

  test('should return error when the todo does not exist', async () => {
    const result = await supertest(app)
      .put(`/todos/${originalTodo.id + 1}`)
      .send({ text: 'Test todo', priority: 3, done: false })
      .expect(404)

    expect(result.body.success).toBe(false)
  })

  test('should return errors', async () => {
    // prettier-ignore
    const result = await supertest(app)
      .put(`/todos/${originalTodo.id}`)
      .send({ priority: 3, done: false })
      .expect(400)

    expect(result.body.success).toBe(false)
    expect(result.body.errors.text._errors).toEqual(['You must specify the todo text.'])
  })
})

describe('DELETE /todos', () => {
  let originalTodo: Todo

  beforeEach(async () => {
    originalTodo = await createTodo({ text: 'Foobar', priority: 5, done: false })
  })

  test('should delete a new todo', async () => {
    // prettier-ignore
    const result = await supertest(app)
      .delete(`/todos/${originalTodo.id}`)
      .expect(200)

    expect(result.body.success).toBe(true)
  })

  test('should return error when the todo does not exist', async () => {
    const result = await supertest(app)
      .delete(`/todos/${originalTodo.id + 1}`)
      .expect(404)

    expect(result.body.success).toBe(false)
  })
})
