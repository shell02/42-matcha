import { DatabaseService } from './database.service'
import {
  CreatePictureParams,
  UserStatus,
  updateUserParams,
} from '../models/User'
import { createUserInfoParams, updateUserInfoParams } from '../models/UserInfo'
import bcrypt = require('bcrypt')
import { deleteFile } from '../middleware/multer.middleware'
import { RequestError } from '../validation/utils'

export interface ProfileData {
  blocked: boolean
  liked: boolean
  viewed: boolean
  matched: boolean
}

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

  async getProfileData(
    userID: number,
    profileID: number,
  ): Promise<ProfileData | RequestError> {
    if (userID === profileID) {
      return {
        message: 'Cannot view yourself',
        status: 400,
      }
    }
    const isBlocked = await this.db.isBlockedofUser(userID, profileID)
    const isLiked = await this.db.isLikeofUser(userID, profileID)
    const isViewed = await this.db.isViewofUser(userID, profileID)
    const isMatched = await this.db.isConnectionofUser(userID, profileID)
    return {
      blocked: isBlocked,
      liked: isLiked,
      viewed: isViewed,
      matched: isMatched,
    }
  }

  async addViewToUser(
    seenID: number,
    viewerID: number,
  ): Promise<string | RequestError> {
    if (seenID === viewerID) {
      return {
        message: 'Cannot view yourself',
        status: 403,
      }
    }
    const user = await this.db.findOneByID(seenID)
    const viewer = await this.db.findOneByID(viewerID)
    if (!user || !viewer) {
      return {
        message: 'User not found',
        status: 404,
      }
    }
    const isBlocked = await this.db.isBlockedByUser(viewerID, seenID)
    if (isBlocked) {
      return {
        message: 'Forbidden action',
        status: 403,
      }
    }
    const isViewed = await this.db.isViewofUser(seenID, viewerID)
    if (isViewed) {
      return {
        message: 'User already viewed',
        status: 403,
      }
    }
    const res1 = await this.db.addViewToUser(seenID, viewerID)
    const res2 = await this.db.addHistoryToUser(viewerID, seenID)
    if (!res1 || !res2) {
      return {
        message: 'Server error',
        status: 500,
      }
    }
    return 'view'
  }

  async addLikeToUser(
    userID: number,
    likerID: number,
  ): Promise<string | RequestError> {
    let message = 'like'
    if (userID === likerID) {
      return {
        message: 'Cannot like yourself',
        status: 403,
      }
    }
    const user = await this.db.findOneByID(userID)
    const liker = await this.db.findOneByID(likerID)
    if (!user || !liker) {
      return {
        message: 'User not found',
        status: 404,
      }
    }
    const isBlocked = await this.db.isBlockedofUser(likerID, userID)
    if (isBlocked) {
      return {
        message: 'Forbidden action',
        status: 403,
      }
    }
    const isLiked = await this.db.isLikeofUser(userID, likerID)
    if (isLiked) {
      return {
        message: 'User already liked',
        status: 403,
      }
    }
    const isLikedBack = await this.db.isLikeofUser(likerID, userID)
    if (isLikedBack) {
      message = 'likeBack'
      const res = await this.db.addConnectionToUser(userID, likerID)
      if (!res) {
        return {
          message: 'Server error',
          status: 500,
        }
      }
    }
    const res = await this.db.addLikeToUser(userID, likerID)
    if (!res) {
      return {
        message: 'Server error',
        status: 500,
      }
    }
    return message
  }

  async removeLikeFromUser(
    userID: number,
    likerID: number,
  ): Promise<string | RequestError> {
    if (userID === likerID) {
      return {
        message: 'Cannot unlike yourself',
        status: 403,
      }
    }
    const isLiked = await this.db.isLikeofUser(userID, likerID)
    if (!isLiked) {
      return {
        message: 'User not liked',
        status: 403,
      }
    }
    const res = await this.db.removeLikeFromUser(userID, likerID)
    if (!res) {
      return {
        message: 'Server error',
        status: 500,
      }
    }
    return 'unlike'
  }

  async addConnectionToUser(
    userID: number,
    toUserID: number,
  ): Promise<boolean> {
    if (userID === toUserID) {
      return false
    }
    const isConnected = await this.db.isConnectionofUser(userID, toUserID)
    if (isConnected) {
      return false
    }
    const res = await this.db.addConnectionToUser(userID, toUserID)
    if (!res) {
      return false
    }
    return true
  }

  async addBlockToUser(
    userID: number,
    blockedID: number,
  ): Promise<void | RequestError> {
    if (userID === blockedID) {
      return {
        message: 'Cannot block yourself',
        status: 403,
      }
    }
    const isBlocked = await this.db.isBlockedofUser(blockedID, userID)
    if (isBlocked) {
      return {
        message: 'User already blocked',
        status: 403,
      }
    }
    const res = await this.db.addBlockedToUser(userID, blockedID)
    if (!res) {
      return {
        message: 'Server error',
        status: 500,
      }
    } else {
      await this.db.removeLikeFromUser(userID, blockedID)
      await this.db.removeLikeFromUser(blockedID, userID)
      await this.db.removeConnectionFromUser(userID, blockedID)
    }
    return
  }

  async removeBlockFromUser(
    userID: number,
    blockedID: number,
  ): Promise<void | RequestError> {
    if (userID === blockedID) {
      return {
        message: 'Cannot unblock yourself',
        status: 403,
      }
    }
    const isBlocked = await this.db.isBlockedofUser(blockedID, userID)
    if (!isBlocked) {
      return {
        message: 'User not blocked',
        status: 403,
      }
    }
    const res = await this.db.removeBlockedFromUser(userID, blockedID)
    if (!res) {
      return {
        message: 'Server error',
        status: 500,
      }
    }
    return
  }
}
