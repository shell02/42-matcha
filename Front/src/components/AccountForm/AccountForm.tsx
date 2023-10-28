import { Button, Stack, TextField } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

function AccountForm() {
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })
  const { register, handleSubmit, formState } = form
  const { errors } = formState
  const onSubmit = (data: FormValues) => {
    console.log(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} width={600}>
        <TextField
          type='text'
          label='First Name'
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          type='text'
          label='Last Name'
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <TextField
          type='email'
          label='Email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          type='password'
          label='Password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          type='password'
          label='Confirm Password'
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Button type='submit' variant='contained'>
          Validate
        </Button>
      </Stack>
    </form>
  )
}

export default AccountForm
