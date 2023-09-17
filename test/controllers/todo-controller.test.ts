import { describe, test, expect, beforeEach } from 'bun:test'
import supertest from 'supertest'
import { createApp } from '../../src/app'
import { createTodo } from '../factories/todo-factory'
import { Todo } from '@prisma/client'

const app = createApp()

describe('GET /todos', () => {
  test('should list the todos', async () => {
    const todo1 = await createTodo()
    const todo2 = await createTodo()

    supertest(app)
      .get('/todos')
      .expect(200)
      .expect({
        success: true,
        data: {
          todos: [todo2, todo1],
          meta: {
            count: 0,
            page: 1,
            page_size: 10,
          },
        },
      })
      .end()
  })

  test('should pass on the query params', async () => {
    const todoParams = [{ text: 'C' }, { text: 'B' }, { text: 'A' }]

    for (const params of todoParams) {
      await createTodo(params)
    }

    supertest(app)
      .get('/todos?order_by[text]=asc')
      .expect(200)
      .expect((res) => {
        const texts = res.body.data.todos.map((todo: any) => todo.text)
        expect(texts).toEqual(['A', 'B', 'C'])
      })
  })
})

describe('POST /todos', () => {
  test('should create a new todo', async () => {
    supertest(app)
      .post('/todos')
      .send({ text: 'Test todo', priority: 3, done: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true)
        expect(res.body.data.text).toBe('Test todo')
        expect(res.body.data.priority).toBe(3)
        expect(res.body.data.done).toBe(false)
      })
  })

  test('should return errors', async () => {
    supertest(app)
      .post('/todos')
      .send({ priority: 3, done: false })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.errors.text._errors).toEqual(['You must specify the todo text.'])
      })
  })
})

describe('PUT /todos', () => {
  let originalTodo: Todo

  beforeEach(async () => {
    originalTodo = await createTodo({ text: 'Foobar', priority: 5, done: false })
  })

  test('should create a new todo', async () => {
    supertest(app)
      .put(`/todos/${originalTodo.id}`)
      .send({ text: 'Test todo', priority: 3, done: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true)
        expect(res.body.data.text).toBe('Test todo')
        expect(res.body.data.priority).toBe(3)
        expect(res.body.data.done).toBe(false)
      })
  })

  test('should return errors', async () => {
    supertest(app)
      .put(`/todos/${originalTodo.id}`)
      .send({ priority: 3, done: false })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.errors.text._errors).toEqual(['You must specify the todo text.'])
      })
  })
})
