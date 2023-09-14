import { Request, Response } from 'express'
import { listTodos } from '../core/list-todos'

export async function getTodos(req: Request, res: Response) {
  const result = await listTodos(req.query)
  res.json({ success: true, data: result })
}
