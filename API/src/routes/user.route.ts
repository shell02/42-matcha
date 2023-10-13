import express = require('express')
import { UserController } from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middleware'
export const userRouter = express.Router()

const users: UserController = new UserController()
userRouter.route('/').get(verifyJWT, users.getAllUsers)
