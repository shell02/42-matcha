import * as express from 'express'
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import { type Express, type Request, type Response } from 'express'
import { DatabaseService } from './src/services/database.service'

const app: Express = express()

const dbService = new DatabaseService()

const affQuery = async () => {
  await dbService
    .createUser({
      username: 'MarieP',
      email: 'marie.pliot@gmail.com',
      firstName: 'Marie',
      lastName: 'Pliot',
      password: 'banana',
    })
    .catch((error) => console.log(error))

  const users = await dbService.findAllUsers()
  console.log(users)
}

affQuery()

app.get('/', (req: Request, res: Response) => {
  res.send('Hi there')
})

app.listen(3001, () => {
  console.log('Listen on port 3001...')
})
