import { useQuery } from 'react-query'
import { refreshToken } from '../components/RefreshToken'
import Cookies from 'js-cookie'

function Home() {
  const token = Cookies.get('accessToken')

  useQuery(
    ['home'],
    async () => {
      console.log('Bearer ' + token)
      fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (res.status === 403) {
            await refreshToken()
            return null
          }
          return res.json()
        })
        .then((json) => {
          console.log(json)
        })
    },
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
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
