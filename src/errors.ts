export class ValidationError extends Error {
  public errors: any

  constructor(errorMap: any) {
    super('Invalid parameters')
    this.name = 'ValidationError'
    this.errors = errorMap
  }
}
