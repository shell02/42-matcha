import { JwtPayload } from 'jwt-decode'

//AUTH

export interface AuthContextType {
  authToken: string | undefined
  id: number
  status: number
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
