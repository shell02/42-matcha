import express = require('express')
import { UserController } from '../controllers/user.controller'
import { verifyJWT } from '../middleware/auth.middleware'
import { upload } from '../middleware/multer.middleware'
import { validateUsersID } from '../validation/user.validation'
export const userRouter = express.Router()

const users: UserController = new UserController()
userRouter.route('/').get(verifyJWT, users.getAllUsers)
userRouter.route('/findUser').get(verifyJWT, users.getUserById)
userRouter.route('/getUserInfo').get(verifyJWT, users.getUserInfoById)
userRouter.route('/getPhotos').get(verifyJWT, users.getPhotos)

userRouter.route('/updateAccount').patch(verifyJWT, users.updateAccount)
userRouter
  .route('/updateUserInfo')
  .patch(verifyJWT, users.updateOrCreateUserInfo)
userRouter.route('/assignProfilePic').patch(verifyJWT, users.assignProfilePic)

userRouter
  .route('/postPhoto')
  .post(verifyJWT, upload.single('photo'), users.postPhoto)

userRouter.route('/deletePhoto').delete(verifyJWT, users.deletePhoto)

userRouter
  .route('/profileData')
  .get(verifyJWT, validateUsersID, users.getProfileData)
userRouter.route('/like').post(verifyJWT, validateUsersID, users.likeUser)
userRouter.route('/unlike').post(verifyJWT, validateUsersID, users.unlikeUser)
userRouter.route('/block').post(verifyJWT, validateUsersID, users.blockUser)
userRouter.route('/unblock').post(verifyJWT, validateUsersID, users.unblockUser)
userRouter.route('/view').post(verifyJWT, validateUsersID, users.viewUser)
// userRouter.route('/report').post(verifyJWT, users.reportUser)
