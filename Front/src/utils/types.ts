import { JwtPayload } from 'jwt-decode'
import { Socket } from 'socket.io-client'

//AUTH

export interface AuthContextType {
  authToken: string | undefined
  id: number
  status: number
  socket: Socket
}

export interface DecodedJWT extends JwtPayload {
  id: number
  userStatus: number
}

//USERINFO

export enum GenderType {
  WOMAN,
  MAN,
  AGENDER,
  NONBINARY,
  GENDERFLUID,
  OTHER,
}

export enum SexualPrefType {
  ViewWomen,
  ViewMen,
  ViewBoth,
}

export enum NotificationType {
  LikeReceived,
  ProfileViewed,
  PrivateMessage,
  LikedBack,
  Unliked,
}
