import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import MySnackBar from '../../components/MySnackBar'

interface BodyParams {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  password?: string
}

function Register() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [registered, setRegistered] = useState<boolean>(false)
  const [body, setBody] = useState<BodyParams>({})

  const navigate = useNavigate()

  const { refetch } = useQuery(
    ['register'],
    async () => {
      setErrorMessage('')
      return fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          if ('status' in json && json.status !== 201) {
            if ('message' in json && typeof json.message === 'string')
              setErrorMessage(json.message)
            else setErrorMessage('Error')
          } else {
            setRegistered(true)
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

  const schema = yup.object().shape({
    username: yup
      .string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Invalid character in your username')
      .required('Please provide a username'),
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Please provide an email'),
    firstName: yup.string().required('Please provide your first name'),
    lastName: yup.string().required('Please provide your last name'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/^[a-zA-Z0-9!@#$%^&*]+$/, 'Invalid character in your password')
      .required('Please provide a password'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Password should be the same')
      .required('Password should be the same'),
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

  const onSubmit = (data: FieldValues) => {
    setBody({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    })
    refetch()
  }

  return (
    <>
      <div className='title'>REGISTER</div>
      <div className='formContainer'>
        {registered ? (
          <>
            Successful registration! Please check your email to verify your
            account. If you did not receive an email, you might have registered
            with the wrong email.
            <Button disableRipple onClick={() => navigate('/')}>
              Back
            </Button>
          </>
        ) : (
          <>
            {errorMessage && (
              <MySnackBar severity='error' message={errorMessage} />
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  id='username'
                  label='Username'
                  error={!!errors.username}
                  helperText={errors.username && errors.username.message}
                  {...register('username')}
                />
                <TextField
                  id='email'
                  label='Email'
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  {...register('email')}
                />
                <TextField
                  id='firstName'
                  label='First Name'
                  error={!!errors.firstName}
                  helperText={errors.firstName && errors.firstName.message}
                  {...register('firstName')}
                />
                <TextField
                  id='lastName'
                  label='Last Name'
                  error={!!errors.lastName}
                  helperText={errors.lastName && errors.lastName.message}
                  {...register('lastName')}
                />
                <TextField
                  id='password'
                  label='Password'
                  type='password'
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
                  {...register('password')}
                />
                <TextField
                  id='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                  {...register('confirmPassword')}
                />
                <Button id='register' variant='contained' type='submit'>
                  Register
                </Button>
              </Stack>
            </form>
          </>
        )}
      </div>
      {!registered && (
        <>
          Already have an account?
          <Button disableRipple onClick={() => navigate('/login')}>
            Login
          </Button>
        </>
      )}
    </>
  )
}

export default Register
