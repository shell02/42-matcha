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
  let response = true
  fetch('http://localhost:3001/auth/refreshToken', {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => {
      if (res.status !== 200) {
        response = false
        fetch('http://localhost:3001/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
        Cookies.remove('accessToken')
        window.location.reload()
      }
      return res.json()
    })
    .then((json) => {
      if (json.accessToken) {
        Cookies.set('accessToken', json.accessToken, {
          sameSite: 'Strict',
          secure: true,
        })
      } else {
        response = false
      }
    })
  return response
}
