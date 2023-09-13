import { describe, expect, test, beforeAll } from 'bun:test'
import { HelloWorldUseCase } from '../../src/core/hello-world'

describe('HelloWorldUseCase', () => {
  test('should return Hello World when no name parameter is given', () => {
    expect(HelloWorldUseCase({})).toBe('Hello World!')
  })

  test('should return Hello with name when a name parameter is given', () => {
    expect(HelloWorldUseCase({ name: 'Jimbo' })).toBe('Hello Jimbo!')
  })
})
