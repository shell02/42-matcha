import { DatabaseService } from './database.service'
import {
  CreatePictureParams,
  UserStatus,
  updateUserParams,
} from '../models/User'
import { createUserInfoParams, updateUserInfoParams } from '../models/UserInfo'
import bcrypt = require('bcrypt')
import { deleteFile } from '../middleware/multer.middleware'

export class UserService {
  private readonly db: DatabaseService = new DatabaseService()

  async allUsers() {
    return this.db.findAllUsersSafe()
  }

  async getUserById(id: number) {
    return this.db.findOneByID(id)
  }

  async getUserInfoById(id: number) {
    return this.db.findOneInfoByID(id)
  }

  async updateUser(id: number, body: updateUserParams) {
    if (body.password) body.password = await bcrypt.hash(body.password, 10)
    return this.db.updateUser(id, body)
  }

  async updateUserInfo(
    id: number,
    body: updateUserInfoParams & updateUserParams,
  ) {
    await this.updateUser(id, { username: body.username })
    return this.db.updateUserInfo(id, body)
  }

  async createUserInfo(params: createUserInfoParams) {
    await this.checkOrUpdateUserStatus(params.userID, UserStatus.NoProfilePic)
    return this.db.createUserInfo(params)
  }

  async getPhotos(id: number) {
    return this.db.findPicturesOfUser(id)
  }

  async postPhoto(id: number, pictureParams: CreatePictureParams) {
    await this.db.createPicture(id, pictureParams)
    const userInfo = await this.getUserInfoById(id)
    if (!userInfo?.profilePic) {
      const picture = await this.getPhotos(id)
      if (picture) {
        await this.db.assignProfilePic(id, picture[0].pictureID)
        await this.checkOrUpdateUserStatus(id, UserStatus.FullAccess)
      }
    }
    return
  }

  async deletePhoto(id: number, pictureID: number) {
    const userInfo = await this.getUserInfoById(id)
    if (userInfo?.profilePic?.pictureID === pictureID)
      throw new Error('Cannot delete profile picture')
    const pictureInfos = await this.db.findPictureByID(pictureID)
    if (!pictureInfos || !pictureInfos.path)
      throw new Error('Picture not found')
    const filename = pictureInfos.path.split('/')[1]
    deleteFile(filename)
    await this.db.deletePicture(pictureID)
  }

  async assignProfilePic(id: number, pictureID: number) {
    return this.db.assignProfilePic(id, pictureID)
  }

  async checkOrUpdateUserStatus(id: number, newStatus: UserStatus) {
    const user = await this.db.findOneByID(id)
    const status = user?.userStatus
    if (status && newStatus > status)
      return this.db.updateUser(id, { userStatus: newStatus })
  }
}
