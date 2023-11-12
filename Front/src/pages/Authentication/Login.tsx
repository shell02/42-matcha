import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import MySnackBar from '../../components/MySnackBar'
import { accountSchema } from '../../utils/schemas'
import { jwtDecode } from 'jwt-decode'
import { DecodedJWT } from '../../utils/types'

interface Props {
  setLogin: (login: string) => void
}

function Login({ setLogin }: Props) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFetch = async (data: FieldValues) => {
    setErrorMessage('')
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    const json = await res.json()
    if ('status' in json && json.status !== 200) {
      if ('message' in json && typeof json.message === 'string')
        setErrorMessage(json.message)
      else setErrorMessage('Error')
    } else {
      setLogin(json.accessToken)
      Cookies.set('accessToken', json.accessToken)
      const decodedToken = jwtDecode<DecodedJWT>(json.accessToken)
      if (decodedToken?.userStatus === 1) navigate('/editProfile')
      else navigate('/')
    }
    return json
  }

  useQuery({
    queryKey: ['login'],
    queryFn: handleFetch,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const form = useForm({
    resolver: yupResolver(accountSchema.pick(['username', 'password'])),
    mode: 'onBlur',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <>
      {errorMessage && <MySnackBar severity='error' message={errorMessage} />}
      <div className='title'>LOGIN</div>
      <div className='formContainer'>
        <form onSubmit={handleSubmit(handleFetch)} noValidate>
          <Stack spacing={2}>
            <TextField
              id='username'
              label='Username'
              error={!!errors.username}
              helperText={errors.username && errors.username.message}
              {...register('username')}
            />
            <TextField
              id='password'
              label='Password'
              type='password'
              error={!!errors.password}
              helperText={errors.password && errors.password.message}
              {...register('password')}
            />
            <Button id='login' variant='contained' type='submit'>
              login
            </Button>
          </Stack>
        </form>
      </div>
      Don&apos;t have an account?
      <Button disableRipple onClick={() => navigate('/register')}>
        Register
      </Button>
      <Button disableRipple onClick={() => navigate('/forgot_password')}>
        Forgot Password
      </Button>
    </>
  )
}

export default Login
