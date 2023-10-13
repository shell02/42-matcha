import { UserRow, UserStatus, createUserParams } from '../models/User'
import {
  RequestError,
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
  private readonly jwtToken: string

  constructor() {
    if (!process.env.JSON_WEB_TOKEN) {
      throw new Error('Missing env variable')
    }
    this.jwtToken = process.env.JSON_WEB_TOKEN
  }

  // TODO: async function to send mail with verify or reset token

  async registerUser(body: RegisterBody): Promise<UserRow | RequestError> {
    let user = null
    let dbError: RequestError = {
      message: 'Database Error',
      status: 500,
    }
    const error = validateRegisterBody(body)
    if (error !== '') {
      return {
        message: error,
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
        return {
          message: e.message,
          status: 409,
        }
      } else {
        return dbError
      }
    }
    if (!user) {
      return dbError
    }
    const verifyToken = jwt.sign(
      { username: user.username },
      this.jwtToken,
      { expiresIn: '10min' },
    )
    // TODO: send mail
    user = await this.db.updateUser(user.userID, { verifyToken })
    if (!user) {
      return dbError
    }
    return user
  }

  async verifyUser(token: string): Promise<RequestError | Tokens> {
    let username = ''
    let error: null | string = null
    jwt.verify(token, this.jwtToken, (err, decoded) => {
      if (err) {
        error = err.message
        // TODO: if err.message = jwtexpired, send another email and updateUser
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
        status: 400,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }
    const accessToken = jwt.sign(
      { 
        username: user.username,
        userStatus: user.userStatus,
      },
      this.jwtToken,
      { expiresIn: '15min' },
    )
    const refreshToken = jwt.sign(
      { 
        username: user.username,
        userStatus: user.userStatus,
      },
      this.jwtToken,
      { expiresIn: '2d' },
    )

    await this.db.updateUser(user.userID, { refreshToken, verifyToken: null, userStatus: UserStatus.IncompleteProfile })
    return {
      refreshToken,
      accessToken,
    }
  }

  async refreshUserToken(token: string): Promise<RequestError | Tokens> {
    let username = ''
    let error = null
    jwt.verify(token, this.jwtToken, (err, decoded) => {
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
      { 
        username: user.username,
        userStatus: user.userStatus,
      },
      this.jwtToken,
      { expiresIn: '15min' },
    )

    return {
      accessToken,
    }
  }

  // TODO: async funtion ForgotPassword to generate resetToken and send mail

  async resetPassword(token: string, password: unknown) {
    let pswd:string = ''
    if (typeof password === 'string') {
      pswd = password
    } else {
      return {
        message: 'Bad Request',
        status: 400,
      }
    }
    let username = ''
    let error = null
    jwt.verify(token, this.jwtToken, (err, decoded) => {
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
