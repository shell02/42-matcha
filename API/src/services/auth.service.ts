import { UserRow, createUserParams } from '../models/User'
import {
  RequestError,
  isString,
  validateRegisterBody,
} from '../validation/utils'
import { DatabaseService } from './database.service'

import bcrypt = require('bcrypt')
import jwt = require('jsonwebtoken')

export interface RegisterBody {
  username: never
  email: never
  firstName: never
  lastName: never
  password: never
}

export interface Tokens {
  accessToken: string
  refreshToken?: string
}

export class AuthService {
  private readonly db: DatabaseService = new DatabaseService()

  async registerUser(body: RegisterBody): Promise<UserRow | RequestError> {
    let user = null
    if (!validateRegisterBody(body)) {
      return {
        // TODO : be more precise in message
        message: 'Bad Request',
        status: 400,
      }
    }
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const params: createUserParams = {
        ...body,
        password: hashedPassword,
      }
      user = await this.db.createUser(params)
    } catch (e: unknown) {
      if (e instanceof Error) {
        const error: RequestError = {
          message: e.message,
          status: 409,
        }
        return error
      }
    }
    if (!user) {
      return {
        message: 'Database Error',
        status: 500,
      }
    }
    if (!process.env.JSON_WEB_TOKEN) {
      return {
        message: 'Missing env variable',
        status: 500,
      }
    }
    const verifyToken = jwt.sign(
      { username: user.username },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: '10min' },
    )
    // TODO: send mail
    user = await this.db.updateUser(user.userID, { verifyToken })
    if (!user) {
      return {
        message: 'Database Error',
        status: 500,
      }
    }
    return user
  }

  async verifyUser(token: string): Promise<RequestError | Tokens> {
    if (!process.env.JSON_WEB_TOKEN) {
      return {
        message: 'Missing env variable',
        status: 500,
      }
    }
    let username = ''
    let error = null
    jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, decoded) => {
      if (err) {
        error = err.message
        return
      }
      if (decoded && typeof decoded !== 'string') {
        username = decoded.username ? decoded.username : ''
      }
    })
    if (error) {
      return {
        message: error,
        status: 403,
      }
    }
    const tokenUser = await this.db.findOneByToken('verifyToken', token)
    const user = await this.db.findOneByUsername(username)
    if (!user || !tokenUser) {
      return {
        message: 'User not found',
        status: 500,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: '15min' },
    )
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: '2d' },
    )

    await this.db.updateUser(user.userID, { refreshToken, verifyToken: null })
    return {
      refreshToken,
      accessToken,
    }
  }

  async refreshUserToken(token: string): Promise<RequestError | Tokens> {
    if (!process.env.JSON_WEB_TOKEN) {
      return {
        message: 'Missing env variable',
        status: 500,
      }
    }
    let username = ''
    let error = null
    jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, decoded) => {
      if (err) {
        error = err.message
        return
      }
      if (decoded && typeof decoded !== 'string') {
        username = decoded.username ? decoded.username : ''
      }
    })
    if (error) {
      return {
        message: error,
        status: 403,
      }
    }
    const tokenUser = await this.db.findOneByToken('refreshToken', token)
    const user = await this.db.findOneByUsername(username)
    if (!user || !tokenUser) {
      return {
        message: 'User not found',
        status: 500,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: '15min' },
    )

    return {
      accessToken,
    }
  }

  async resetPassword(token: string, password: unknown) {
    if (!isString(password)) {
      return {
        message: 'Bad Request',
        status: 400,
      }
    }
    // TODO: from unknown to string
    const pswd: string = password
    if (!process.env.JSON_WEB_TOKEN) {
      return {
        message: 'Missing env variable',
        status: 500,
      }
    }
    let username = ''
    let error = null
    jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, decoded) => {
      if (err) {
        error = err.message
        return
      }
      if (decoded && typeof decoded !== 'string') {
        username = decoded.username ? decoded.username : ''
      }
    })
    if (error) {
      return {
        message: error,
        status: 403,
      }
    }
    const tokenUser = await this.db.findOneByToken('resetToken', token)
    const user = await this.db.findOneByUsername(username)
    if (!user || !tokenUser) {
      return {
        message: 'User not found',
        status: 500,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }
    const hashedPassword = await bcrypt.hash(pswd, 10)
    await this.db.updateUser(user.userID, {
      resetToken: null,
      password: hashedPassword,
    })
    return
  }
}
