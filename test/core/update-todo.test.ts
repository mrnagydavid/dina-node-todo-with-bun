import { beforeEach, describe, expect, test } from 'bun:test'
import { Todo } from '@prisma/client'
import { updateTodo } from '../../src/core/update-todo'
import { prisma } from '../../src/gateways/prisma-client'
import { NotFoundError, ValidationError } from '../../src/errors'
import { createTodo } from '../factories/todo-factory'

describe('updateTodo', () => {
  let originalTodo: Todo

  beforeEach(async () => {
    originalTodo = await createTodo({ text: 'Foobar', priority: 5, done: false })
  })

  test('should update an existing todo', async () => {
    const todo = await updateTodo({
      id: originalTodo.id,
      text: 'Test todo',
      priority: 1,
      done: true,
    })

    const result = await prisma().todo.findFirst()

    expect(result).toEqual(todo)
  })

  test('should throw an error when the ID field is missing', async () => {
    try {
      await updateTodo({ text: 'Test todo', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is not a number', async () => {
    try {
      await updateTodo({ id: 'asdf', text: 'Test todo', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is not an integer', async () => {
    try {
      await updateTodo({ id: 1.5, text: 'Test todo', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is negative', async () => {
    try {
      await updateTodo({ id: -1, text: 'Test todo', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the text field is missing', async () => {
    try {
      await updateTodo({ id: originalTodo.id, priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['You must specify the todo text.'])
    }
  })

  test('should throw an error when the text field is too short', async () => {
    try {
      await updateTodo({ id: originalTodo.id, text: '', priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['The todo text should be at least 1 character long.'])
    }
  })

  test('should throw an error when the text field is too long', async () => {
    try {
      await updateTodo({ id: originalTodo.id, text: 'x'.repeat(256), priority: 1, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.text._errors).toEqual(['The todo text should not be longer than 255 characters.'])
    }
  })

  test('should throw an error when the priority field is too low', async () => {
    try {
      await updateTodo({ id: originalTodo.id, text: 'Test todo', priority: 0, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.priority._errors).toEqual(['The priority should be a number between 1 and 5.'])
    }
  })

  test('should throw an error when the priority field is too high', async () => {
    try {
      await updateTodo({ id: originalTodo.id, text: 'Test todo', priority: 6, done: false })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.priority._errors).toEqual(['The priority should be a number between 1 and 5.'])
    }
  })

  test('should throw an error when the done field is missing', async () => {
    try {
      await updateTodo({ id: originalTodo.id, text: 'Test todo', priority: 1 })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.done._errors).toEqual(['The "done" field should be defined.'])
    }
  })

  test('should throw an error when the todo does not exist', async () => {
    try {
      await updateTodo({ id: originalTodo.id + 1, text: 'Test todo', priority: 1 })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError)
    }
  })
})
