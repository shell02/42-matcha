import { Button, TextField } from '@mui/material'

function Register() {
  return (
    <div className='formContainer'>
      <TextField id='username' label='Username' />
      <TextField id='email' label='Email' />
      <TextField id='firstName' label='First Name' />
      <TextField id='lastName' label='Last Name' />
      <TextField id='password' label='Password' />
      <Button id='register' variant='contained'>
        Register
      </Button>
    </div>
  )
}

export default Register
