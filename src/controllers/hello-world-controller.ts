import { Request, Response } from 'express'
import { sayHello } from '../core/hello-world'

export function getHelloWorld(req: Request, res: Response) {
  res.send(sayHello(req.query))
}
