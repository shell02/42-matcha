import { useState } from 'react'
import './Authentication.scss'
import Login from './Login'
import Register from './Register'
import { Button } from '@mui/material'

type AuthPage = 'login' | 'register'

function Authentication() {
  const [authPage, setAuthPage] = useState<AuthPage>('login')

  return (
    <div className='authentication'>
      <div className='logContainer'>
        <div className='title'>{authPage.toUpperCase()}</div>
        {authPage === 'login' ? <Login /> : <Register />}
        <div className='changeAuthPage'>
          {authPage === 'login' ? (
            <>
              Don&apos;t have an account?
              <Button disableRipple onClick={() => setAuthPage('register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?
              <Button disableRipple onClick={() => setAuthPage('login')}>
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Authentication
