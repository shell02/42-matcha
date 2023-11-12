import { yupResolver } from '@hookform/resolvers/yup'
import { TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import MySnackBar from '../../components/MySnackBar'
import { accountSchema } from '../../utils/schemas'

function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [mailStatus, setMailStatus] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const { refetch } = useQuery({
    queryKey: ['forgotPassword'],
    queryFn: () => {
      setErrorMessage('')
      setMailStatus('')
      const body = {
        email,
      }
      fetch('http://localhost:3001/auth/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status === 204) {
            setMailStatus('Mail sent')
          }
          return res.json()
        })
        .then((json) => {
          if ('status' in json && json.status !== 204) {
            setErrorMessage(json.message)
          }
        })
    },
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountSchema.pick(['email'])),
  })

  const onSubmit = () => {
    refetch()
  }

  return (
    <>
      {errorMessage && <MySnackBar severity='error' message={errorMessage} />}
      {mailStatus && <MySnackBar severity='info' message={mailStatus} />}

      <div className='title'>Forgot my Password</div>
      <div className='formContainer'>
        <TextField
          id='email'
          label='Email'
          error={!!errors.email}
          helperText={errors.email && errors.email.message}
          {...register('email')}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          id='forgotPassword'
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        >
          Send mail
        </Button>
      </div>
    </>
  )
}

export default ForgotPassword
