import { useQuery } from 'react-query'
import { isTokenExpired, refreshToken } from '../components/RefreshToken'
import Cookies from 'js-cookie'

function Home() {
  let token = Cookies.get('accessToken') || ''

  useQuery(
    ['refresh_test'],
    async () => {
      if (isTokenExpired(token)) {
        if (await refreshToken()) {
          token = Cookies.get('accessToken') || ''
        } else {
          return
        }
      }

      const res = await fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      console.log(await res.json())
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  return (
    <div>
      <p>Home is building...</p>
      <p>Home is building...</p>
      <p>Home is building...</p>
    </div>
  )
}

export default Home
