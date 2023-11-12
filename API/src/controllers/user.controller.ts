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
    res.status(201)
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
    res.status(201)
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
}
