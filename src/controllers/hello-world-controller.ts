import { Request, Response } from 'express'
import { HelloWorldUseCase } from '../core/hello-world'

export function getHelloWorld(req: Request, res: Response) {
  res.send(HelloWorldUseCase(req.query))
}
