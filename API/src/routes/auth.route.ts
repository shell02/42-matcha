import express = require('express')
import { AuthController } from '../controllers/auth.controller'
import {
  validateEmail,
  validateLoginBody,
  validateRegisterBody,
  validateResetBody,
  validateToken,
} from '../validation/auth.validation'
export const authRouter = express.Router()

const auth: AuthController = new AuthController()
authRouter.post('/register', validateRegisterBody, auth.RegisterUser)
authRouter.post('/verify', validateToken, auth.VerifyUser)
authRouter.post('/newMail', validateToken, auth.SendNewVerificationEmail)
authRouter.get('/refreshToken', auth.RefreshToken)
authRouter.post('/login', validateLoginBody, auth.LoginUser)
authRouter.post('/logout', auth.LogoutUser)
authRouter.post('/resetPassword', validateResetBody, auth.ResetPassword)
authRouter.post('/forgotPassword', validateEmail, auth.ForgotPassword)
