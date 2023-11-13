import * as yup from 'yup'

export const accountSchema = yup.object().shape({
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

export const updateAccountSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide a valid email')
    .required('Please provide an email'),
  firstName: yup.string().required('Please provide your first name'),
  lastName: yup.string().required('Please provide your last name'),
  password: yup
    .string()
    .transform((x) => (x === '' ? undefined : x))
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/, 'Invalid character in your password')
    .optional(),
  confirmPassword: yup
    .string()
    .transform((x) => (x === '' ? undefined : x))
    .oneOf([yup.ref('password')], 'Password should be the same')
    .optional(),
})

export const updateInfoSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  gender: yup.number().required('Gender is required'),
  sexualPref: yup.number().required('Preferences are required'),
  age: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'You cannot be born in the future'),
  biography: yup.string().required('Biography is required'),
  // interests: yup.array().required('Interests are required'),
  enableGPS: yup.boolean().required('GPS is required'),
})
