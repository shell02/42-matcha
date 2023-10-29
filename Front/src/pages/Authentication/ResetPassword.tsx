import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import MySnackBar from '../../components/MySnackBar'

function ResetPassword() {
  const token = useParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [passStatus, setPassStatus] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()

  const { refetch } = useQuery(
    ['resetPassword'],
    () => {
      const body = {
        token: token.token,
        password,
      }
      fetch('http://localhost:3001/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status !== 204) return res.json()
          else {
            setPassStatus('Password changed')
            setTimeout(() => {
              navigate('/login')
            }, 1000)
          }
        })
        .then((json) => {
          console.log(json)
          if ('status' in json && json.status !== 204) {
            if (json.message === 'jwt expired') {
              setErrorMessage('Token expired')
            } else {
              setErrorMessage(json.message)
            }
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = () => {
    refetch()
  }

  return (
    <>
      {errorMessage && <MySnackBar severity='error' message={errorMessage} />}
      {passStatus && <MySnackBar severity='info' message={passStatus} />}
      <div className='title'>Reset my Password</div>
      <div className='formContainer'>
        <TextField
          id='password'
          label='Password'
          type='password'
          error={!!errors.password}
          helperText={errors.password && errors.password.message}
          {...register('password')}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          id='confirmPassword'
          label='Confirm Password'
          type='password'
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && errors.confirmPassword.message}
          {...register('confirmPassword')}
        />
        <Button
          id='resetPassword'
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        >
          Reset password
        </Button>
      </div>
    </>
  )
}

export default ResetPassword
