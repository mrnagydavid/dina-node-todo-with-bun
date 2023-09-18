export default {
  todo_automatic_deletion_in_mins: getIntValue('TODO_AUTOMATIC_DELETION_IN_MINS', 5),
}

function getIntValue(key: string, defaultValue?: number): number {
  if (typeof process.env[key] === undefined && typeof defaultValue === undefined) {
    throw new Error(`Missing environment variable ${key}`)
  } else if (process.env[key] === undefined) {
    return defaultValue as number
  }

  return parseInt(process.env[key] as string)
}
