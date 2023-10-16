import { NextFunction, Request, Response } from 'express'
import { RequestError, isEmail, isInterface, isString } from './utils'

export const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  let error: RequestError | null = null
  if (
    !isInterface(body, [
      'username',
      'email',
      'password',
      'lastName',
      'firstName',
    ])
  ) {
    error = {
      message: 'Invalid body parameters',
      status: 400,
    }
  } else if (!body.email || !isEmail(body.email)) {
    error = {
      message: 'Invalid email',
      status: 400,
    }
  } else if (!body.username || !isString(body.username)) {
    error = {
      message: 'Invalid username',
      status: 400,
    }
  } else if (!body.password || !isString(body.password)) {
    error = {
      message: 'Invalid password',
      status: 400,
    }
  } else if (!body.lastName || !isString(body.lastName)) {
    error = {
      message: 'Invalid lastName',
      status: 400,
    }
  } else if (!body.firstName || !isString(body.firstName)) {
    error = {
      message: 'Invalid firstName',
      status: 400,
    }
  } else {
    next()
  }
  if (error) {
    res.status(error.status).send(error)
  }
}

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  let error: RequestError | null = null

  if (!body) {
    error = {
      message: 'Missing body',
      status: 400,
    }
  } else if (!body.token || !isString(body.token)) {
    error = {
      message: 'Missing token',
      status: 400,
    }
  } else {
    next()
  }
  if (error) {
    res.status(error.status).send(error)
  }
}

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  let error: RequestError | null = null

  if (!body) {
    error = {
      message: 'Missing body',
      status: 400,
    }
  } else if (!body.email || !isEmail(body.email)) {
    error = {
      message: 'Missing or invalid email',
      status: 400,
    }
  } else {
    next()
  }
  if (error) {
    res.status(error.status).send(error)
  }
}

export const validateResetBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  let error: RequestError | null = null

  if (!body) {
    error = {
      message: 'Missing body',
      status: 400,
    }
  } else if (!body.token || !isString(body.token)) {
    error = {
      message: 'Missing token',
      status: 400,
    }
  } else if (!body.password || !isString(body.password)) {
    error = {
      message: 'Missing or invalid password',
      status: 400,
    }
  } else {
    next()
  }
  if (error) {
    res.status(error.status).send(error)
  }
}
