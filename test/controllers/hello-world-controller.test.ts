import { Request, Response } from 'express'
import { describe, expect, test, beforeAll, mock } from 'bun:test'
import { getHelloWorld } from '../../src/controllers/hello-world-controller'

describe('getHelloWorld', () => {
  test('should return Hello World when no name parameter is given', () => {
    let sendMockPayload = ''
    const sendMock = mock((payload) => (sendMockPayload = payload))

    const request = { query: {} }
    const response: unknown = {
      send: sendMock,
    }

    getHelloWorld(request as Request, response as Response)

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMockPayload).toBe('Hello World!')
  })

  test('should return Hello with name when a name parameter is given', () => {
    let sendMockPayload = ''
    const sendMock = mock((payload) => (sendMockPayload = payload))

    const request: unknown = { query: { name: 'Jimbo' } }
    const response: unknown = {
      send: sendMock,
    }

    getHelloWorld(request as Request, response as Response)

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMockPayload).toBe('Hello Jimbo!')
  })
})
