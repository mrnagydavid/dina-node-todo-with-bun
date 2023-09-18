import { beforeEach } from 'bun:test'
import { prisma } from '../src/gateways/prisma-client'

beforeEach(async () => {
  await prisma().$transaction([prisma().todoScheduledForDeletion.deleteMany(), prisma().todo.deleteMany()])
})
