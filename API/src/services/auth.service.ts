import {
  UserRow,
  UserStatus,
  createUserParams,
  loginParams,
} from '../models/User'
import { RequestError, encodeToken } from '../validation/utils'
import { DatabaseService } from './database.service'
import nodemailer = require('nodemailer')

import bcrypt = require('bcrypt')
import jwt = require('jsonwebtoken')

export interface Tokens {
  accessToken: string
  refreshToken?: string
}

export class AuthService {
  private readonly db: DatabaseService = new DatabaseService()
  private readonly jwtToken: string
  private readonly mail: string
  private readonly password: string

  constructor() {
    if (
      !process.env.JSON_WEB_TOKEN ||
      !process.env.MAIL_USER ||
      !process.env.MAIL_PASSWORD
    ) {
      throw new Error('Missing env variable')
    }
    this.jwtToken = process.env.JSON_WEB_TOKEN
    this.mail = process.env.MAIL_USER
    this.password = process.env.MAIL_PASSWORD
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.mail,
        pass: this.password,
      },
    })
    await transporter.sendMail({
      from: this.mail,
      to,
      subject,
      text,
    })
  }

  async registerUser(body: createUserParams): Promise<UserRow | RequestError> {
    let user: UserRow | null = null
    const dbError: RequestError = {
      message: 'Database Error',
      status: 500,
    }

    try {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const params = {
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

    const verifyToken = jwt.sign({ username: user.username }, this.jwtToken, {
      expiresIn: '10min',
    })
    user = await this.db.updateUser(user.userID, { verifyToken })
    if (!user) {
      return dbError
    }
    const encodedToken = encodeToken(verifyToken)

    const mailSubject = 'Matcha - Please verify your email'
    const to = user.email
    const text = `Please click the following link to verify your email: http://localhost:3000/verify/${encodedToken}`
    this.sendMail(to, mailSubject, text)

    return user
  }

  async sendNewVerifyMail(token: string): Promise<RequestError | void> {
    let username = ''
    let error: null | string = null

    jwt.verify(
      token,
      this.jwtToken,
      { ignoreExpiration: true },
      (err, decoded) => {
        if (decoded && typeof decoded !== 'string') {
          username = decoded.username ? decoded.username : ''
        } else if (err) {
          error = err.message
          return
        }
      },
    )
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
        status: 404,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }

    const verifyToken = jwt.sign({ username: user.username }, this.jwtToken, {
      expiresIn: '10min',
    })
    await this.db.updateUser(user.userID, { verifyToken })
    if (!user) {
      return {
        message: 'Database Error',
        status: 500,
      }
    }
    const endodedToken = encodeToken(verifyToken)

    const mailSubject = 'Matcha - Please verify your email'
    const to = user.email
    const text = `Please click the following link to verify your email:\nhttp://localhost:3000/verify/${endodedToken}`
    this.sendMail(to, mailSubject, text)
    return
  }

  async verifyUser(token: string): Promise<RequestError | Tokens> {
    let username = ''
    let error: null | string = null

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

    const tokenUser = await this.db.findOneByToken('verifyToken', token)
    const user = await this.db.findOneByUsername(username)
    if (!user || !tokenUser) {
      return {
        message: 'User not found',
        status: 404,
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
        id: user.userID,
      },
      this.jwtToken,
      { expiresIn: '1min' },
    )
    const refreshToken = jwt.sign(
      {
        username: user.username,
        userStatus: user.userStatus,
      },
      this.jwtToken,
      { expiresIn: '2d' },
    )

    await this.db.updateUser(user.userID, {
      refreshToken,
      verifyToken: null,
      userStatus: UserStatus.IncompleteProfile,
    })
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
        status: 404,
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
        id: user.userID,
      },
      this.jwtToken,
      { expiresIn: '1min' },
    )

    return {
      accessToken,
    }
  }

  async forgotPassword(email: string): Promise<RequestError | void> {
    const user = await this.db.findOneByEmail(email)
    if (!user) {
      return {
        message: 'User not found',
        status: 404,
      }
    }
    const resetToken = jwt.sign({ username: user.username }, this.jwtToken, {
      expiresIn: '10min',
    })
    await this.db.updateUser(user.userID, { resetToken })
    if (!user) {
      return {
        message: 'Database Error',
        status: 500,
      }
    }
    const encodedToken = encodeToken(resetToken)

    const mailSubject = 'Matcha - Reset your password'
    const to = user.email
    const text = `Please click the following link to reset your password:\nhttp://localhost:3000/reset/${encodedToken}`
    this.sendMail(to, mailSubject, text)
    return
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<RequestError | void> {
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
        status: 404,
      }
    }
    if (user.username !== tokenUser.username) {
      return {
        message: 'Invalid token',
        status: 401,
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await this.db.updateUser(user.userID, {
      resetToken: null,
      password: hashedPassword,
    })
    return
  }

  async login(body: loginParams): Promise<RequestError | Tokens> {
    const user = await this.db.findOneByUsername(body.username)
    if (!user) {
      return {
        message: 'User not found',
        status: 401,
      }
    }
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password)
    if (!isPasswordCorrect) {
      return {
        message: 'Incorrect password',
        status: 401,
      }
    }
    if (user.userStatus === UserStatus.Unverified) {
      return {
        message: 'Please verify your email',
        status: 403,
      }
    }

    const accessToken = jwt.sign(
      {
        username: user.username,
        userStatus: user.userStatus,
        id: user.userID,
      },
      this.jwtToken,
      { expiresIn: '10min' },
    )
    const refreshToken = jwt.sign(
      {
        username: user.username,
        userStatus: user.userStatus,
      },
      this.jwtToken,
      { expiresIn: '2d' },
    )

    await this.db.updateUser(user.userID, { refreshToken })
    return {
      refreshToken,
      accessToken,
    }
  }

  async logout(token: string): Promise<RequestError | void> {
    const user = await this.db.findOneByToken('refreshToken', token)
    if (!user) {
      return {
        message: 'User not found',
        status: 404,
      }
    }
    await this.db.updateUser(user.userID, { refreshToken: null })
    return
  }
}
