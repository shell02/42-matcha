import { Application, Request, Response } from 'express'
import express = require('express')
import cors = require('cors')
import cookieParser = require('cookie-parser')
import dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

import { authRouter } from './routes/auth.route'
import { userRouter } from './routes/user.route'

export const createApp = (): Application => {
  const app: Application = express()

  const allowlist = [
    'http://localhost:3000',
    'http://localhost:5432',
    'http://localhost:3001',
  ]
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, permission?: boolean) => void,
    ) => {
      if (!origin || allowlist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    optionsSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/auth', authRouter)
  app.use('/users', userRouter)

  app.get('/', (req: Request, res: Response) => {
    res.send('Hi there')
  })

  return app
}
