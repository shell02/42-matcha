import jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'

export interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload | undefined
}

export const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
  const token = authHeader.split(' ')[1]
  if (!process.env.JSON_WEB_TOKEN) return res.sendStatus(500)
  jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403)
    if (decoded && typeof decoded !== 'string') {
      req.user = decoded.username ? decoded.username : ''
    }
    next()
  })
}
