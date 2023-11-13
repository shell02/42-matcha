import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import MySnackBar from '../../components/MySnackBar'
import { accountSchema } from '../../utils/schemas'

function Register() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [registered, setRegistered] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleFetch = (data: FieldValues) => {
    delete data.confirmPassword
    setErrorMessage('')
    return fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
  }

  useQuery({
    queryKey: ['register'],
    queryFn: handleFetch,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const form = useForm({
    resolver: yupResolver(accountSchema),
    mode: 'onBlur',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

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
            <form onSubmit={handleSubmit(handleFetch)}>
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
