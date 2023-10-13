import { RegisterBody } from '../services/auth.service'

export interface RequestError {
  message: string
  status: number
}

export const isInterface = (obj: object, interfaceProps: string[]): boolean => {
  for (const prop of interfaceProps) {
    if (!(prop in obj)) {
      return false
    }
  }
  for (const prop in obj) {
    if (!interfaceProps.includes(prop)) {
      return false
    }
  }
  return true
}

export const validateRegisterBody = (body: RegisterBody): string => {
  if (
    !isInterface(body, [
      'username',
      'email',
      'password',
      'lastName',
      'firstName',
    ])
  )
    return "Incomplete parameters"
  if (!body.email || !isEmail(body.email)) return 'Invalid email'
  if (!body.username || !isString(body.username)) return 'Invalid username'
  if (!body.password || !isString(body.password)) return 'Invalid password'
  if (!body.lastName || !isString(body.lastName)) return 'Invalid lastName'
  if (!body.firstName || !isString(body.firstName)) return 'Invalid firstName'
  return ''
}

export const isEmail = (email: string): boolean => {
  const e = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return e.test(email)
}

export const isString = (input: unknown): boolean => {
  if (typeof input === 'string' || input instanceof String) {
    if (input === '') return false
    return true
  } else {
    return false
  }
}

export const isNumber = (input: unknown): boolean => {
  if (typeof input === 'number' || input instanceof Number) {
    return true
  } else {
    return false
  }
}
