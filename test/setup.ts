import { beforeEach } from 'bun:test'
import { prisma } from '../src/gateways/prisma-client'

beforeEach(async () => {
  await prisma().todo.deleteMany()
})
