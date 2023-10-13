import { DatabaseService } from './database.service'

export class UserService {
  private readonly db: DatabaseService = new DatabaseService()

  async allUsers() {
    return this.db.findAllUsersSafe()
  }
}
