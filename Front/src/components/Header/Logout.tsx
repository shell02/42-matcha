import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

function Logout() {
  const { refetch } = useQuery({
    queryKey: ['logout'],
    queryFn: () => {
      return fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    },

    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const onClickLogout = () => {
    refetch()
    Cookies.remove('accessToken')
    window.location.reload()
  }

  return (
    <>
      <Button variant='contained' onClick={onClickLogout}>
        Logout
      </Button>
    </>
  )
}

export default Logout
