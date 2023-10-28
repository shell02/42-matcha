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
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormValues {
  username: string
  gender: 'woman' | 'man'
  preferences: 'women' | 'men' | 'both'
  dateOfBirth: Date
  biography: string
  // interests: string[]
  enableGPS: boolean
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  gender: yup.string().oneOf(['woman', 'man']).required('Gender is required'),
  preferences: yup
    .string()
    .oneOf(['women', 'men', 'both'])
    .required('Preferences are required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  biography: yup.string().required('Biography is required'),
  // interests: yup.array().required('Interests are required'),
  enableGPS: yup.boolean().required('GPS is required'),
})

function ProfileForm() {
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
          label='Username'
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <FormLabel>Gender</FormLabel>
        <RadioGroup defaultValue='woman' {...register('gender')}>
          <FormControlLabel value='woman' control={<Radio />} label='Woman' />
          <FormControlLabel value='man' control={<Radio />} label='Man' />
        </RadioGroup>
        <FormLabel>I&apos;m interest by</FormLabel>
        <RadioGroup defaultValue='women' {...register('preferences')}>
          <FormControlLabel value='women' control={<Radio />} label='Women' />
          <FormControlLabel value='men' control={<Radio />} label='Men' />
          <FormControlLabel value='both' control={<Radio />} label='Both' />
        </RadioGroup>
        <TextField
          type='date'
          label='Date of birth'
          {...register('dateOfBirth')}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type='text'
          label='About you'
          {...register('biography')}
          multiline
          rows={4}
          error={!!errors.biography}
          helperText={errors.biography?.message}
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
