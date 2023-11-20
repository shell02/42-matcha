import { Response } from 'express'
import { CustomRequest } from '../middleware/auth.middleware'
import { NotifyService } from '../services/notify.service'

export class NotifyController {
  private readonly notify: NotifyService = new NotifyService()

  GetNotificationsofUser = async (req: CustomRequest, res: Response) => {
    if (req.user) {
      const response = await this.notify.getNotificationsOfUser(req.user.id)
      const isRequestError = 'status' in response && 'message' in response

      if (isRequestError) {
        res.status(response.status).send(response)
      } else {
        res.status(200).send(response)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }

  DeleteNotification = async (req: CustomRequest, res: Response) => {
    if (req.user) {
      const response = await this.notify.deleteNotification(
        Number(req.query.notifID),
      )

      if (response) {
        res.status(response.status).send(response)
      } else {
        res.sendStatus(200)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }

  DeleteAllNotifications = async (req: CustomRequest, res: Response) => {
    if (req.user) {
      const response = await this.notify.deleteAllNotifications(req.user.id)

      if (response) {
        res.status(response.status).send(response)
      } else {
        res.sendStatus(200)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }

  CreateNotification = async (req: CustomRequest, res: Response) => {
    console.log(req.query)
    if (req.user) {
      const response = await this.notify.createNotification(
        req.user.id,
        Number(req.query.toUserID),
        Number(req.query.type),
      )

      if (response) {
        res.status(response.status).send(response)
      } else {
        res.sendStatus(200)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  }
}
