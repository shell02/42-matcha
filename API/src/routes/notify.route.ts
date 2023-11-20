import express = require('express')
import { NotifyController } from '../controllers/notify.controller'
import { verifyJWT } from '../middleware/auth.middleware'

export const notifyRouter = express.Router()

const notify: NotifyController = new NotifyController()

notifyRouter.get('/', verifyJWT, notify.GetNotificationsofUser)
notifyRouter.delete('/', verifyJWT, notify.DeleteNotification)
notifyRouter.post('/', verifyJWT, notify.CreateNotification)
