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

export const isEmail = (email: string): boolean => {
  const e = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return e.test(email)
}

export const isString = (input: unknown): boolean => {
  if (typeof input === 'string' || input instanceof String) {
    if (input.trim() === '') return false
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

export const isBoolean = (input: unknown): boolean => {
  if (typeof input === 'boolean' || input instanceof Boolean) {
    return true
  } else {
    return false
  }
}

export const encodeToken = (token: string): string => {
  return token.replace(/\./g, '%25')
}

export const decodeToken = (token: string): string => {
  return token.replace(/%/g, '.')
}
