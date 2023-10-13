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
    const verifyToken = req.params.verifyToken
    const tokens = await this.auth.verifyUser(verifyToken)

    const isRequestError = 'status' in tokens && 'message' in tokens
    const isTokens = 'accessToken' in tokens && 'refreshToken' in tokens

    if (isTokens) {
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      })
      res.json({ accessToken: tokens.accessToken })
    } else if (isRequestError) {
      res.status(tokens.status).send(tokens)
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
    console.log(req.body)
    res.send('Hello')
  }

  ResetPassword = async (req: Request, res: Response) => {
    // const resetToken = req.params.resetToken
    // const response = await this.auth.resetPassword(
    //   resetToken,
    //   req.body.password,
    // )
    // const isRequestError = 'status' in response && 'message' in response

    // if (isRequestError) {
    //   res.status(response.status).send(response)
    // } else {
    //   res.status(201).send(response)
    // }

    console.log(req.body)
    res.send('Hello')
  }

  RefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)

    const refreshToken = cookies.jwt
    const tokens = await this.auth.refreshUserToken(refreshToken)

    const isRequestError = 'status' in tokens && 'message' in tokens
    const isTokens = 'accessToken' in tokens

    if (isTokens) {
      res.json({ accessToken: tokens.accessToken })
    } else if (isRequestError) {
      res.status(tokens.status).send(tokens)
    }
  }
}
