import { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { isTokenExpired, refreshToken } from '../components/RefreshToken'
import { AuthContextType } from '../utils/types'
import { jwtDecode } from 'jwt-decode'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState(Cookies.get('accessToken'))
  const [decodedToken, setDecodedToken] = useState(
    authToken && jwtDecode(authToken),
  )

  useEffect(() => {
    ;(async () => {
      if (isTokenExpired(authToken || '')) {
        if (await refreshToken()) {
          setAuthToken(Cookies.get('accessToken'))
        }
      }
    })()
  }, [authToken])

  useEffect(() => {
    setDecodedToken(authToken && jwtDecode(authToken))
  }, [authToken])

  return (
    <AuthContext.Provider
      value={{
        authToken,
        id: decodedToken?.id || 0,
        status: decodedToken?.userStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
