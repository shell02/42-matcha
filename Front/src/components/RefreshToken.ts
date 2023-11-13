import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export function isTokenExpired(token: string) {
  if (!token) return false
  const decodedToken = jwtDecode(token)
  const currentTime = Date.now() / 1000
  if (decodedToken.exp === undefined) return false
  return decodedToken.exp < currentTime
}

export const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:3001/auth/refreshToken', {
      method: 'GET',
      credentials: 'include',
    })

    if (response.status !== 200) {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      Cookies.remove('accessToken')
      window.location.reload()
      throw new Error('Refresh token failed')
    }

    const json = await response.json()

    if (json.accessToken) {
      Cookies.set('accessToken', json.accessToken, {
        sameSite: 'Strict',
        secure: true,
      })
      return true
    } else {
      throw new Error('Access token not found in response')
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}
