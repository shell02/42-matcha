import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import * as yup from 'yup'
import MySnackBar from '../../components/MySnackBar'

interface Props {
  setLogin: React.Dispatch<React.SetStateAction<string>>
}

function Login(props: Props) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFetch = (data: FieldValues) => {
    setErrorMessage('')
    return fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        if ('status' in json && json.status !== 200) {
          if ('message' in json && typeof json.message === 'string')
            setErrorMessage(json.message)
          else setErrorMessage('Error')
        } else {
          props.setLogin(json.accessToken)
          Cookies.set('accessToken', json.accessToken)
          navigate('/')
        }
        return json
      })
  }

  useQuery(['login'], handleFetch, {
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const schema = yup.object().shape({
    username: yup
      .string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Invalid character in your username')
      .required('Please provide a username'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/^[a-zA-Z0-9!@#$%^&*]+$/, 'Invalid character in your password')
      .required('Please provide a password'),
  })

  const form = useForm({
    resolver: yupResolver(schema),
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
