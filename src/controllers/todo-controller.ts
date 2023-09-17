import { Request, Response } from 'express'
import { listTodos } from '../core/list-todos'
import { createTodo } from '../core/create-todo'
import { updateTodo } from '../core/update-todo'

export async function getTodos(req: Request, res: Response) {
  const result = await listTodos(req.query)
  res.json({ success: true, data: result })
}

export async function postTodo(req: Request, res: Response) {
  const result = await createTodo(req.body)
  res.json({ success: true, data: result })
}

export async function putTodo(req: Request, res: Response) {
  const params = {
    ...req.body,
    id: req.params.todoId,
  }
  const result = await updateTodo(params)
  res.json({ success: true, data: result })
}
