import { describe, test, expect } from 'bun:test'
import supertest from 'supertest'
import { createApp } from '../../src/app'
import { createTodo } from '../factories/todo-factory'

const app = createApp()

describe('GET /todos', () => {
  test('should return 200 OK', async () => {
    const todo = await createTodo()

    supertest(app)
      .get('/todos')
      .expect(200)
      .expect({
        success: true,
        data: {
          todos: [todo],
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
