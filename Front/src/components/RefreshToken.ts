import Cookies from 'js-cookie'

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
