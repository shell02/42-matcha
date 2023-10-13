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

export const validateRegisterBody = (body: RegisterBody): boolean => {
  if (
    !isInterface(body, [
      'username',
      'email',
      'password',
      'lastName',
      'firstName',
    ])
  )
    return false
  if (!body.email || !isEmail(body.email)) return false
  if (!body.username || !isString(body.username)) return false
  if (!body.password || !isString(body.password)) return false
  if (!body.lastName || !isString(body.lastName)) return false
  if (!body.firstName || !isString(body.firstName)) return false
  return true
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
