import { describe, expect, test } from 'bun:test'
import { createTodo } from '../../src/core/create-todo'
import { prisma } from '../../src/gateways/prisma-client'
import { ValidationError } from '../../src/errors'

describe('createTodo', () => {
  test('should create a new todo', async () => {
    const todo = await createTodo({
      text: 'Test todo',
      priority: 1,
      done: false,
    })

    const result = await prisma().todo.findFirst()

    expect(result).toEqual(todo)
  })

  test('should throw an error when the text field is missing', async () => {
    try {
      await createTodo({ priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['You must specify the todo text.'])
    }
  })

  test('should throw an error when the text field is too short', async () => {
    try {
      await createTodo({ text: '', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['The todo text should be at least 1 character long.'])
    }
  })

  test('should throw an error when the text field is too long', async () => {
    try {
      await createTodo({ text: 'x'.repeat(256), priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['The todo text should not be longer than 255 characters.'])
    }
  })

  test('should throw an error when the priority field is too low', async () => {
    try {
      await createTodo({ text: 'Test todo', priority: 0, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.priority._errors).toEqual(['The priority should be a number between 1 and 5.'])
    }
  })

  test('should throw an error when the priority field is too high', async () => {
    try {
      await createTodo({ text: 'Test todo', priority: 6, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.priority._errors).toEqual(['The priority should be a number between 1 and 5.'])
    }
  })

  test('should create a non-done todo when done is not specified', async () => {
    await createTodo({ text: 'Test todo', priority: 1 })

    const result = await prisma().todo.findFirst()

    expect(result!.done).toEqual(false)
  })

  // These don't work for some reason.
  // Either I mess it up, or bun does not work exactly as Jest

  // test('should throw an error when the text field is missing - variant 2', async () => {
  //   await expect(createTodo({ priority: 1, done: false })).rejects
  // })

  // test('should throw an error when the text field is missing - variant 3', async () => {
  //   expect(() => createTodo({ priority: 1, done: false })).toThrow()
  // })

  test('should schedule for deletion when the todo is marked as done', async () => {
    const todo = await createTodo({
      text: 'Test todo',
      priority: 1,
      done: true,
    })

    const result = await prisma().todoScheduledForDeletion.findFirst()

    expect(result?.todo_id).toBe(todo.id)
  })

  test('should not schedule for deletion when the todo is not marked as done', async () => {
    const todo = await createTodo({
      text: 'Test todo',
      priority: 1,
      done: false,
    })

    const result = await prisma().todoScheduledForDeletion.findFirst()

    expect(result).toBe(null)
  })
})
