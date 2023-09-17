import { beforeEach, describe, expect, test } from 'bun:test'
import { deleteTodo } from '../../src/core/delete-todo'
import { prisma } from '../../src/gateways/prisma-client'
import { NotFoundError, ValidationError } from '../../src/errors'
import { createTodo } from '../factories/todo-factory'
import { Todo } from '@prisma/client'

describe('deleteTodo', () => {
  let originalTodo: Todo

  beforeEach(async () => {
    originalTodo = await createTodo({ text: 'Foobar', priority: 5, done: false })
  })

  test('should delete an existing todo', async () => {
    await deleteTodo({ id: originalTodo.id })

    const result = await prisma().todo.findFirst()

    expect(result).toBe(null)
  })

  test('should throw an error when the ID field is missing', async () => {
    try {
      await deleteTodo({})
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is not a number', async () => {
    try {
      await deleteTodo({ id: 'asdf' })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is not an integer', async () => {
    try {
      await deleteTodo({ id: 1.5 })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the ID field is negative', async () => {
    try {
      await deleteTodo({ id: -1 })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)

      const validationError = error as ValidationError
      expect(validationError.errors.id._errors).toEqual(['You must specify the ID of the todo'])
    }
  })

  test('should throw an error when the todo does not exist', async () => {
    try {
      await deleteTodo({ id: originalTodo.id + 1 })
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError)
    }
  })
})
