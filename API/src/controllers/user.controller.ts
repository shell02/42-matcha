import { CustomRequest } from '../middleware/auth.middleware'
import { UserService } from '../services/user.service'
import { Request, Response } from 'express'

export class UserController {
  private readonly users: UserService = new UserService()

  getAllUsers = async (req: CustomRequest, res: Response) => {
    res.send(await this.users.allUsers())
  }

  getUserById = async (req: Request, res: Response) => {
    const response = await this.users.getUserById(Number(req.query.id))
    const parsedResponse = {
      firstName: response?.firstName,
      lastName: response?.lastName,
      email: response?.email,
      profilePicId: response?.profilePicID,
    }
    res.status(200).send(parsedResponse)
  }

  getUserInfoById = async (req: Request, res: Response) => {
    const response = await this.users.getUserInfoById(Number(req.query.id))
    res.status(200).send(response)
  }

  updateAccount = async (req: Request, res: Response) => {
    await this.users.updateUser(Number(req.query.id), req.body)
    res.sendStatus(201)
  }

  updateOrCreateUserInfo = async (req: Request, res: Response) => {
    const hasInfo = await this.users.getUserInfoById(Number(req.query.id))
    if (hasInfo?.age) {
      await this.users.updateUserInfo(Number(req.query.id), req.body)
    } else {
      await this.users.createUserInfo({
        gender: req.body.gender,
        age: req.body.age,
        sexualPref: req.body.sexualPref,
        biography: req.body.biography,
        latitude: 0,
        longitude: 0,
        userID: Number(req.query.id),
      })
    }
    res.sendStatus(201)
  }

  getPhotos = async (req: Request, res: Response) => {
    const response = await this.users.getPhotos(Number(req.query.id))
    res.status(200).send(response)
  }

  postPhoto = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send('Pas de fichier téléchargé.')
    }

    const filename = req.file.filename

    const pictureParams = {
      path: `uploads/${filename}`,
    }

    await this.users.postPhoto(Number(req.query.id), pictureParams)
    res
      .status(201)
      .send({ message: 'Fichier téléchargé avec succès.', file: req.file })
  }

  deletePhoto = async (req: Request, res: Response) => {
    try {
      await this.users.deletePhoto(
        Number(req.query.id),
        Number(req.body.pictureID),
      )
      res.status(200).send({ message: 'Fichier supprimé avec succès.' })
    } catch (error) {
      res.status(400).send({ message: error })
      console.log(error)
    }
  }

  assignProfilePic = async (req: Request, res: Response) => {
    await this.users.assignProfilePic(
      Number(req.query.id),
      Number(req.body.pictureID),
    )
    res.status(201).send({ message: 'Photo de profil mise à jour.' })
  }

  async getProfileData(req: CustomRequest, res: Response) {
    const response = await this.users.getProfileData(
      req.user?.id || 0,
      Number(req.query.toUserID),
    )
    if ('status' in response) {
      res.status(response.status).send(response)
    } else {
      res.status(200).send(response)
    }
    // res.status(200).send('ok')
  }

  likeUser = async (req: CustomRequest, res: Response) => {
    const response = await this.users.addLikeToUser(
      Number(req.query.toUserID),
      req.user?.id || 0,
    )
    if (response instanceof String) {
      return res.status(201).send({ notify: response })
    } else if (response instanceof Object) {
      res.status(response.status).send(response)
    }
  }

  unlikeUser = async (req: CustomRequest, res: Response) => {
    const response = await this.users.removeLikeFromUser(
      Number(req.query.toUserID),
      req.user?.id || 0,
    )
    if (response instanceof String) {
      return res.status(201).send({ notify: response })
    } else if (response instanceof Object) {
      res.status(response.status).send(response)
    }
  }

  blockUser = async (req: CustomRequest, res: Response) => {
    const response = await this.users.addBlockToUser(
      req.user?.id || 0,
      Number(req.query.toUserID),
    )
    if (response instanceof Object) {
      res.status(response.status).send(response)
    } else {
      res.sendStatus(201)
    }
  }

  unblockUser = async (req: CustomRequest, res: Response) => {
    const response = await this.users.removeBlockFromUser(
      req.user?.id || 0,
      Number(req.query.toUserID),
    )
    if (response instanceof Object) {
      res.status(response.status).send(response)
    } else {
      res.sendStatus(201)
    }
  }

  viewUser = async (req: CustomRequest, res: Response) => {
    const response = await this.users.addViewToUser(
      Number(req.query.toUserID),
      req.user?.id || 0,
    )
    if (response instanceof String) {
      return res.status(201).send({ notify: response })
    } else if (response instanceof Object) {
      res.status(response.status).send(response)
    }
  }
}
