import jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'
import { UserStatus } from '../models/User'

export interface CustomRequest extends Request {
  user?: {
    id: number
    username: string
    userStatus: UserStatus
  }
}

export const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
  const token = authHeader.split(' ')[1]
  if (!process.env.JSON_WEB_TOKEN)
    return res
      .status(500)
      .json({ message: 'Missing env variable', status: 500 })
  jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403)
    if (decoded && typeof decoded !== 'string') {
      req.user = {
        id: decoded.id,
        username: decoded.username,
        userStatus: decoded.userStatus,
      }
    }
    next()
  })
}
