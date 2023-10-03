import * as express from 'express'
import * as dotenv from 'dotenv'
import { type Express, type Request, type Response } from 'express'

dotenv.config({ path: '../.env' })
const app: Express = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hi there')
})

app.listen(3001, () => {
  console.log('Listen on port 3001...')
})
