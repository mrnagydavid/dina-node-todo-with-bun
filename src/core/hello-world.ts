export function HelloWorldUseCase(params: any): string {
  const name = params?.name || 'World'

  return `Hello ${name}!`
}
