import { NextFunction, Response } from 'express'
import { isIDValid } from './utils'
import { CustomRequest } from '../middleware/auth.middleware'

export const validateUsersID = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || !isIDValid(req.user.id)) {
    res.status(400).send('Missing or invalid userID')
  }
  if (!req.query.toUserID || !isIDValid(req.query.toUserID)) {
    res.status(400).send('Missing or invalid toUserID')
  }
  next()
}
export const validateUserID = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || !isIDValid(req.user.id)) {
    res.status(400).send('Missing or invalid userID')
  }
  next()
}
