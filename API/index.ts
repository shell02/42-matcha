import * as express from 'express'
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import { type Express, type Request, type Response } from 'express'
// import { DatabaseService } from './src/services/database.service'

const app: Express = express()

// const dbService = new DatabaseService()

app.get('/', (req: Request, res: Response) => {
  res.send('Hi there')
})

app.listen(3001, () => {
  console.log('Listen on port 3001...')
})
