import { AuthService } from '../services/auth.service'
import { Request, Response } from 'express'

export class AuthController {
  private readonly auth: AuthService = new AuthService()

  RegisterUser = async (req: Request, res: Response) => {
    const response = await this.auth.registerUser(req.body)
    const isRequestError = 'status' in response && 'message' in response

    if (isRequestError) {
      res.status(response.status).send(response)
    } else {
      res.status(201).send(response)
    }
  }

  VerifyUser = async (req: Request, res: Response) => {
    const response = await this.auth.verifyUser(req.body.token)

    const isRequestError = 'status' in response && 'message' in response
    const isTokens = 'accessToken' in response && 'refreshToken' in response

    if (isTokens) {
      res.cookie('jwt', response.refreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      })
      res.json({ accessToken: response.accessToken })
    } else if (isRequestError) {
      res.status(response.status).send(response)
    } else {
      res.status(500).json({ message: 'Server Error' })
    }
  }

  SendNewVerificationEmail = async (req: Request, res: Response) => {
    const response = await this.auth.sendNewVerifyMail(req.body.token)

    if (response) {
      res.status(response.status).send(response)
    } else {
      res.sendStatus(204)
    }
  }

  LoginUser = async (req: Request, res: Response) => {
    // send body to function in authService
    // if result is error, send back error and set status accordingly
    // if result ok, refreshToken in res.cookie and accessToken in res.json --> see VerifyUser for example

    console.log(req.body)
    res.send('Hello')
  }

  LogoutUser = async (req: Request, res: Response) => {
    console.log(req.body)
    res.send('Hello')
  }

  ForgotPassword = async (req: Request, res: Response) => {
    const response = await this.auth.forgotPassword(req.body.email)

    if (response) {
      res.status(response.status).send(response)
    } else {
      res.sendStatus(204)
    }
  }

  ResetPassword = async (req: Request, res: Response) => {
    const response = await this.auth.resetPassword(
      req.body.token,
      req.body.password,
    )

    if (response) {
      res.status(response.status).send(response)
    } else {
      res.sendStatus(204)
    }
  }

  RefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)

    const refreshToken = cookies.jwt
    const response = await this.auth.refreshUserToken(refreshToken)

    const isRequestError = 'status' in response && 'message' in response
    const isTokens = 'accessToken' in response

    if (isTokens) {
      res.json({ accessToken: response.accessToken })
    } else if (isRequestError) {
      res.status(response.status).send(response)
    }
  }
}
