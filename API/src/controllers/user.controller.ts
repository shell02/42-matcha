import { CustomRequest } from '../middleware/auth.middleware'
import { UserService } from '../services/user.service'
import { Response } from 'express'

export class UserController {
  private readonly users: UserService = new UserService()

  getAllUsers = async (req: CustomRequest, res: Response) => {
    res.send(await this.users.allUsers())
  }
}
