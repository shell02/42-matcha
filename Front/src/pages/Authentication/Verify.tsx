import { Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import MySnackBar from '../../components/MySnackBar'

interface Props {
  setLogin: React.Dispatch<React.SetStateAction<string>>
}

function Verify(props: Props) {
  const token = useParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [mailStatus, setMailStatus] = useState<string>('')

  const navigate = useNavigate()

  useQuery(
    ['verify'],
    async () => {
      setErrorMessage('')
      const body = {
        token: token.token,
      }
      return fetch('http://localhost:3001/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          if ('status' in json && json.status !== 201) {
            if ('message' in json && typeof json.message === 'string') {
              setErrorMessage(json.message)
              if (json.message !== 'jwt expired') {
                setTimeout(() => {
                  navigate('/login')
                }, 2000)
              }
            } else {
              setErrorMessage('Error')
              setTimeout(() => {
                navigate('/login')
              }, 2000)
            }
          } else {
            Cookies.set('accessToken', json.accessToken)
            props.setLogin(json.accessToken)
            navigate('/')
          }
          return json
        })
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  const { refetch: refetchMail } = useQuery(
    ['newMail'],
    async () => {
      setErrorMessage('')
      const body = {
        token: token.token,
      }
      fetch('http://localhost:3001/auth/newMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status === 200) {
            setMailStatus('Mail sent')
          }
          return res.json()
        })
        .then((json) => {
          if ('status' in json && json.status !== 200) {
            if ('message' in json && typeof json.message === 'string')
              setMailStatus(json.message)
            else setMailStatus('Error')
          }
          return json
        })
    },
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  return (
    <>
      {mailStatus && <MySnackBar severity='info' message={mailStatus} />}
      <div className='formContainer'>
        {errorMessage === 'jwt expired' ? (
          <>
            <p>Your link has expired. You can request a new mail</p>
            <Button onClick={() => refetchMail()}>Send mail</Button>
          </>
        ) : errorMessage !== '' ? (
          <p>{errorMessage}</p>
        ) : (
          <>
            <p>Verifying your email...</p>
            <CircularProgress />
          </>
        )}
      </div>
    </>
  )
}

export default Verify
