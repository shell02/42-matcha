import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import {
  useGetUserInfo,
  useUpdateUserInfo,
} from '../../hooks/queries/userQueries'
import { updateInfoSchema } from '../../utils/schemas'
import { GenderType, SexualPrefType } from '../../utils/types'

interface FormValues {
  username: string
  gender: GenderType
  sexualPref: SexualPrefType
  age: Date
  biography: string
  interests?: string[]
  enableGPS: boolean
}

function ProfileForm() {
  const { data: userInfo } = useGetUserInfo()
  const updateUserInfo = useUpdateUserInfo()
  const form = useForm<FormValues>({
    resolver: yupResolver(updateInfoSchema),
    mode: 'onBlur',
  })
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  const onSubmit = (data: FormValues) => {
    console.log('date', data.age)
    data.age = new Date(data.age.setDate(data.age.getDate() + 1))
    updateUserInfo.mutateAsync(data)
  }

  useEffect(() => {
    if (userInfo) {
      const date = new Date(userInfo.age)
      userInfo.age = `${date.getFullYear()}-${(
        '0' +
        (date.getMonth() + 1)
      ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      form.reset(userInfo)
    }
  }, [userInfo, form])

  const genderItems = [
    {
      value: GenderType.WOMAN,
      label: 'Woman',
    },
    {
      value: GenderType.MAN,
      label: 'Man',
    },
    {
      value: GenderType.AGENDER,
      label: 'Agender',
    },
    {
      value: GenderType.GENDERFLUID,
      label: 'Genderfluid',
    },
    {
      value: GenderType.NONBINARY,
      label: 'Non-binary',
    },
    {
      value: GenderType.OTHER,
      label: 'Other',
    },
  ]

  const prefItems = [
    {
      value: SexualPrefType.ViewWomen,
      label: 'Women',
    },
    {
      value: SexualPrefType.ViewMen,
      label: 'Men',
    },
    {
      value: SexualPrefType.ViewBoth,
      label: 'Both',
    },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} width={600}>
        <Controller
          name='username'
          control={form.control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              label='Username'
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
            />
          )}
        />
        <Controller
          name='gender'
          control={form.control}
          defaultValue={GenderType.WOMAN}
          render={({ field }) => (
            <>
              <FormLabel>Gender</FormLabel>
              <RadioGroup {...field}>
                {genderItems.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                  />
                ))}
              </RadioGroup>
            </>
          )}
        />
        <Controller
          name='sexualPref'
          control={form.control}
          defaultValue={SexualPrefType.ViewWomen}
          render={({ field }) => (
            <>
              <FormLabel>I&apos;m interested by</FormLabel>
              <RadioGroup {...field}>
                {prefItems.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                  />
                ))}
              </RadioGroup>
            </>
          )}
        />
        <Controller
          name='age'
          control={form.control}
          defaultValue={new Date()}
          render={({ field }) => (
            <TextField
              {...field}
              type='date'
              label='Date of birth'
              error={!!errors.age}
              helperText={errors.age?.message}
              InputLabelProps={{ shrink: true, ...field }}
            />
          )}
        />
        <Controller
          name='biography'
          control={form.control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              label='About you'
              multiline
              rows={4}
              error={!!errors.biography}
              helperText={errors.biography?.message}
            />
          )}
        />
        <FormControl>
          <InputLabel htmlFor='interests' id='test-select-label'>
            Interests
          </InputLabel>
          <Select
            labelId='test-select-label'
            label='Interests'
            // {...register('interests')}
            // error={!!errors.interests}
            // helperText={errors.interests?.message}
            multiple
            value={['a', 'b', 'c']}
          >
            <MenuItem value={'a'}>Ten</MenuItem>
            <MenuItem value={'b'}>Twenty</MenuItem>
            <MenuItem value={'c'}>Thirty</MenuItem>
          </Select>
          {/* <FormHelperText>{errors.interests?.message}</FormHelperText> */}
        </FormControl>
        <FormControlLabel
          label='GPS'
          control={<Switch defaultChecked {...register('enableGPS')} />}
          labelPlacement='start'
        />
        <Button type='submit' variant='contained'>
          Validate
        </Button>
      </Stack>
    </form>
  )
}

export default ProfileForm
