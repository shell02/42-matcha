import {
  notificationDB,
  NotificationRow,
  NotificationType,
} from '../models/Notification'
import { tagDB, TagRow } from '../models/Tag'
import {
  SafeUserRow,
  UserRow,
  PictureRow,
  createUserParams,
  updateUserParams,
  CreatePictureParams,
  userDB,
} from '../models/User'
import {
  GenderType,
  SexualPrefType,
  UserInfoRow,
  createUserInfoParams,
  updateUserInfoParams,
  userInfoDB,
} from '../models/UserInfo'
import { userRelationDB } from '../models/UserRelation'

/**
 * @example
 * userID: number
 * username: string
 * firstName: string
 * lastName: string
 * userInfoID?: number
 * gender?: GenderType
 * age?: Date
 * sexualPref?: SexualPrefType
 * biography?: string
 * latitude?: number
 * longitude?: number
 * onlineStatus?: boolean
 * lastConnect?: Date
 * fameRating?: number
 * profilePic?: PictureRow
 */
export interface FullUserRow extends SafeUserRow {
  userInfoID?: number
  gender?: GenderType
  age?: Date
  sexualPref?: SexualPrefType
  biography?: string
  latitude?: number
  longitude?: number
  onlineStatus?: boolean
  lastConnect?: Date
  fameRating?: number
  profilePic?: PictureRow
}

/**
 * @example
 * userID: number
 * username: string
 * firstName: string
 * lastName: string
 * userInfoID?: number
 * gender?: GenderType
 * age?: Date
 * sexualPref?: SexualPrefType
 * biography?: string
 * latitude?: number
 * longitude?: number
 * onlineStatus?: boolean
 * lastConnect?: Date
 * fameRating?: number
 * tags?: TagRow[]
 * likes?: SafeUserRow[]
 * connected?: SafeUserRow[]
 * block?: SafeUserRow[]
 * blockFrom?: SafeUserRow[]
 * views?: SafeUserRow[]
 * viewHistory?: SafeUserRow[]
 * pictures?: PictureRow[]
 */
export interface ComplexUserRow extends FullUserRow {
  tags?: TagRow[]
  likes?: SafeUserRow[]
  connected?: SafeUserRow[]
  block?: SafeUserRow[]
  blockFrom?: SafeUserRow[]
  views?: SafeUserRow[]
  viewHistory?: SafeUserRow[]
  pictures?: PictureRow[]
}

/**
 * lowercase to camelCase function
 */
const toFullUserRow = (
  user: SafeUserRow,
  userInfo: UserInfoRow | null,
  profilePic: PictureRow | null,
): FullUserRow => {
  let fullUser: FullUserRow = user
  if (userInfo) {
    fullUser = {
      ...user,
      ...userInfo,
    }
  }
  if (profilePic) {
    fullUser.profilePic = profilePic
  }
  return fullUser
}

/**
 * lowercase to camelCase function
 */
const toComplexUserRow = (
  user: SafeUserRow,
  userInfo: UserInfoRow | null,
  tags: TagRow[] | null,
  views: SafeUserRow[] | null,
  viewHistory: SafeUserRow[] | null,
  likes: SafeUserRow[] | null,
  block: SafeUserRow[] | null,
  blockFrom: SafeUserRow[] | null,
  connected: SafeUserRow[] | null,
  pictures: PictureRow[] | null,
): ComplexUserRow => {
  let complexUser: ComplexUserRow = user
  if (userInfo) {
    complexUser = {
      ...user,
      ...userInfo,
    }
  }
  if (tags) {
    complexUser.tags = tags
  }
  if (views) {
    complexUser.views = views
  }
  if (viewHistory) {
    complexUser.viewHistory = viewHistory
  }
  if (connected) {
    complexUser.connected = connected
  }
  if (likes) {
    complexUser.likes = likes
  }
  if (block) {
    complexUser.block = block
  }
  if (blockFrom) {
    complexUser.blockFrom = blockFrom
  }
  if (pictures) {
    complexUser.pictures = pictures
  }
  return complexUser
}

/**
 * Class interacting with the models, CRUD actions on data and error management
 */
export class DatabaseService {
  private readonly users: userDB
  private readonly usersInfo: userInfoDB
  private readonly usersRelation: userRelationDB
  private readonly tags: tagDB
  private readonly notifications: notificationDB

  constructor() {
    this.users = new userDB()
    this.usersInfo = new userInfoDB()
    this.usersRelation = new userRelationDB()
    this.tags = new tagDB()
    this.notifications = new notificationDB()
    this.users.setup()
    this.tags.setup()
  }

  /**
   * Returns all users in an array of UserRow or null if no users were found
   */
  async findAllUsers(): Promise<UserRow[] | null> {
    return this.users.findAll()
  }

  /**
   * Returns all users in an array of SafeUserRow or null if no users were found
   */
  async findAllUsersSafe(): Promise<SafeUserRow[] | null> {
    return this.users.findAllSafe()
  }

  /**
   * Returns all users in an array of FullUserRow or null if no users were found
   */
  async findAllUsersInfo(): Promise<FullUserRow[] | null> {
    const users = await this.users.findAllSafe()
    if (users) {
      const fullUsers: FullUserRow[] = []
      for (const user of users) {
        const userInfo = await this.usersInfo.findByUserID(user.userID)
        let profilePic = null
        if (user.profilePicID)
          profilePic = await this.users.findPictureByID(user.profilePicID)
        fullUsers.push(toFullUserRow(user, userInfo, profilePic))
      }
      return fullUsers
    }
    return users
  }

  /**
   * Create a user and returns the row created or null
   * @throw Error() if email or username already in use
   */
  async createUser(params: createUserParams): Promise<UserRow | null> {
    let user = await this.findOneByEmail(params.email)
    if (user) {
      throw new Error('Email already in use')
    }
    user = await this.findOneByUsername(params.username)
    if (user) {
      throw new Error('Username already in use')
    }
    const res = await this.users.create(params)
    if (res === true) {
      return this.findOneByUsername(params.username)
    }
    return null
  }

  /**
   * Create a userInfo and returns the Full Row created or null
   * @throw Error() if userID not found or user already has userInfo
   */
  async createUserInfo(
    params: createUserInfoParams,
  ): Promise<FullUserRow | null> {
    const user = await this.findOneByID(params.userID)
    if (!user) {
      throw new Error('User not found from userID')
    }
    const userInfo = await this.usersInfo.findByUserID(params.userID)
    if (userInfo) throw new Error('User already has userInfo')
    const res = await this.usersInfo.create(params)
    if (res === true) return this.findOneInfoByID(params.userID)
    return null
  }

  async findOneByID(userID: number): Promise<UserRow | null> {
    return this.users.findOneByID(userID)
  }

  async findOneInfoByID(userID: number): Promise<FullUserRow | null> {
    const user = await this.users.findOneByID(userID)
    if (!user) return null
    const userInfo = await this.usersInfo.findByUserID(userID)
    let profilePic = null
    if (user.profilePicID)
      profilePic = await this.users.findPictureByID(user.profilePicID)
    return toFullUserRow(user, userInfo, profilePic)
  }

  async findOneRelationByID(userID: number): Promise<ComplexUserRow | null> {
    const user = await this.users.findOneByID(userID)
    if (!user) return null
    const userInfo = await this.usersInfo.findByUserID(user.userID)
    const tags = await this.usersRelation.findTagsOfUser(user.userID)
    const views = await this.usersRelation.findViewersOfUser(user.userID)
    const viewHistory = await this.usersRelation.findViewerHistoryOfUser(
      user.userID,
    )
    const connected = await this.usersRelation.findConnectionsOfUser(
      user.userID,
    )
    const likes = await this.usersRelation.findLikesOfUser(user.userID)
    const block = await this.usersRelation.findBlockedOfUser(user.userID)
    const blockFrom = await this.usersRelation.findBlockFromOfUser(user.userID)
    const pictures = await this.users.findPicturesOfUser(user.userID)
    return toComplexUserRow(
      user,
      userInfo,
      tags,
      views,
      viewHistory,
      likes,
      block,
      blockFrom,
      connected,
      pictures,
    )
  }

  async findOneByEmail(email: string): Promise<UserRow | null> {
    return this.users.findOneByEmail(email)
  }

  async findOneByUsername(username: string): Promise<UserRow | null> {
    return this.users.findOneByUsername(username)
  }

  async findOneByToken(
    tokenName: string,
    token: string,
  ): Promise<UserRow | null> {
    return this.users.findOneByToken(tokenName, token)
  }

  async deleteUser(userID: number): Promise<boolean> {
    return this.users.delete(userID)
  }

  async updateUser(
    userID: number,
    params: updateUserParams,
  ): Promise<UserRow | null> {
    const res = await this.users.update(userID, params)
    if (res === true) {
      return this.findOneByID(userID)
    } else {
      throw new Error('Could not update user')
    }
  }

  async updateUserInfo(
    userID: number,
    params: updateUserInfoParams,
  ): Promise<FullUserRow | null> {
    const res = await this.usersInfo.update(userID, params)
    if (res === true) {
      return this.findOneInfoByID(userID)
    }
    return null
  }

  async addViewToUser(
    userID: number,
    viewerID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addViewerToUser(viewerID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async addLikeToUser(
    userID: number,
    likeID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addLikeToUser(likeID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async removeLikeFromUser(
    userID: number,
    likeID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.removeLikeFromUser(likeID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async addHistoryToUser(
    userID: number,
    seenID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addViewerToUserHistory(seenID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async addConnectionToUser(
    userID: number,
    connectID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addConnectionToUser(connectID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async removeConnectionFromUser(
    userID: number,
    connectID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.removeConnectionFromUser(
      connectID,
      userID,
    )
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async addBlockedToUser(
    userID: number,
    blockedID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addBlockedToUser(blockedID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async removeBlockedFromUser(
    userID: number,
    blockedID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.removeBlockedFromUser(
      blockedID,
      userID,
    )
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async addBlockFromToUser(
    userID: number,
    blockedID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.addBlockFromToUser(blockedID, userID)
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async removeBlockFromFromUser(
    userID: number,
    blockedID: number,
  ): Promise<ComplexUserRow | null> {
    const res = await this.usersRelation.removeBlockFromFromUser(
      blockedID,
      userID,
    )
    if (res === true) return this.findOneRelationByID(userID)
    return null
  }

  async findAllTags(): Promise<TagRow[] | null> {
    return this.tags.findAll()
  }

  async findAllTagsOfUser(userID: number): Promise<TagRow[] | null> {
    return this.usersRelation.findTagsOfUser(userID)
  }

  async addTagToUser(userID: number, tagID: number): Promise<boolean> {
    return this.usersRelation.addTagToUser(tagID, userID)
  }

  async removeTagFromUser(userID: number, tagID: number): Promise<boolean> {
    return this.usersRelation.removeTagFromUser(tagID, userID)
  }

  async createTag(content: string): Promise<boolean> {
    return this.tags.create(content)
  }

  async deleteTag(tagID: number): Promise<boolean> {
    return this.tags.delete(tagID)
  }

  async findNotificationsOfUser(
    userID: number,
  ): Promise<NotificationRow[] | null> {
    return this.notifications.findAllToUser(userID)
  }

  async addNotificationToUser(
    toUserID: number,
    fromUserID: number,
    type: NotificationType,
  ): Promise<boolean> {
    return this.notifications.create(fromUserID, toUserID, type)
  }

  async removeNotificationFromUser(notifID: number): Promise<boolean> {
    return this.notifications.delete(notifID)
  }

  async findPictureByID(pictureID: number): Promise<PictureRow | null> {
    return this.users.findPictureByID(pictureID)
  }

  async findPicturesOfUser(userID: number): Promise<PictureRow[] | null> {
    return this.users.findPicturesOfUser(userID)
  }

  async createPicture(
    userID: number,
    params: CreatePictureParams,
  ): Promise<boolean> {
    return this.users.createPicture(userID, params)
  }

  async assignProfilePic(userID: number, pictureID: number): Promise<boolean> {
    return this.users.assignProfilePic(userID, pictureID)
  }

  async deletePicture(pictureID: number): Promise<boolean> {
    return this.users.deletePicture(pictureID)
  }
}
