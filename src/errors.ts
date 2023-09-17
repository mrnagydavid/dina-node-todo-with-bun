export class ValidationError extends Error {
  public errors: any

  constructor(errorMap: any) {
    super('Invalid parameters')
    this.name = 'ValidationError'
    this.errors = errorMap
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found')
    this.name = 'NotFoundError'
  }
}
