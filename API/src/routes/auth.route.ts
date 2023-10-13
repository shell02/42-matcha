import express = require('express')
import { AuthController } from '../controllers/auth.controller'
export const authRouter = express.Router()

const auth: AuthController = new AuthController()
// TODO: verifyToken and resetToken in body, not url 
authRouter.post('/register', auth.RegisterUser)
authRouter.post('/verify/:verifyToken', auth.VerifyUser)
authRouter.post('/login', auth.LoginUser)
authRouter.post('/logout', auth.LogoutUser)
authRouter.post('/reset/:resetToken', auth.ResetPassword)
