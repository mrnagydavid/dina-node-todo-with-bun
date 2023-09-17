import { Request, Response, NextFunction } from 'express'

export function handleErrors(fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
