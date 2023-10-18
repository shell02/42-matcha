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
    const response = await this.auth.login(req.body)
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

  LogoutUser = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.jwt
    if (!refreshToken) return res.sendStatus(401)
    const response = await this.auth.logout(refreshToken)

    if (response) {
      res.status(response.status).send(response)
    } else {
      res.clearCookie('jwt')
      res.sendStatus(200)
    }
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
