import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient

export function prisma() {
  if (!prismaClient) {
    prismaClient = new PrismaClient()
  }
  return prismaClient
}
