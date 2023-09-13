import { describe, expect, test, beforeAll } from 'bun:test'
import { sayHello } from '../../src/core/hello-world'

describe('sayHello', () => {
  test('should return Hello World when no name parameter is given', () => {
    expect(sayHello({})).toBe('Hello World!')
  })

  test('should return Hello with name when a name parameter is given', () => {
    expect(sayHello({ name: 'Jimbo' })).toBe('Hello Jimbo!')
  })
})
