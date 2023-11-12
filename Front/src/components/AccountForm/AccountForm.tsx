import { useEffect } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useGetUser, useUpdateUser } from '../../hooks/queries/userQueries'
import { updateAccountSchema } from '../../utils/schemas'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
}

function AccountForm() {
  const { data: user } = useGetUser()
  const updateUser = useUpdateUser()
  const form = useForm<FormValues>({
    resolver: yupResolver(updateAccountSchema),
    mode: 'onBlur',
  })
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  const onSubmit = (data: FormValues) => {
    updateUser.mutateAsync(data)
  }

  useEffect(() => {
    if (user) {
      form.reset(user)
    }
  }, [user, form])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} width={600}>
        <Controller
          name='firstName'
          control={form.control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              label='First Name'
              error={Boolean(errors.firstName)}
              helperText={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name='lastName'
          control={form.control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              label='Last Name'
              error={Boolean(errors.lastName)}
              helperText={errors.lastName?.message}
            />
          )}
        />
        <Controller
          name='email'
          control={form.control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              label='Email'
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          )}
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
