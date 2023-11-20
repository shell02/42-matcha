import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './providers/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomRoute from './router/Route'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Verify from './pages/Authentication/Verify'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import Register from './pages/Authentication/Register'
import Login from './pages/Authentication/Login'
import EditProfile from './pages/EditProfile/EditProfile'
import Authentication from './pages/Authentication/Authentication'
import ResetPassword from './pages/Authentication/ResetPassword'
import Cookies from 'js-cookie'

import './App.css'
import './colors.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './mui-theme'
import SocketProvider from './providers/SocketProvider'
import { isTokenExpired, refreshToken } from './components/RefreshToken'

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          console.log(error)
          if (failureCount > 2) return false
          if (isTokenExpired(Cookies.get('accessToken') || '')) {
            refreshToken()
          }
          return true
        },
      },
    },
  })
  const [login, setLogin] = useState<string>(Cookies.get('accessToken') || '')

  useEffect(() => {}, [login])

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {login && <Header />}
            <main>
              <Routes>
                {login ? (
                  <>
                    <Route element={<SocketProvider />}>
                      <Route
                        path='/'
                        element={
                          <CustomRoute minStatus={2}>
                            <Home />
                          </CustomRoute>
                        }
                      />
                      <Route
                        path='/search'
                        element={
                          <CustomRoute minStatus={2}>
                            <Search />
                          </CustomRoute>
                        }
                      />
                      <Route
                        path='/user'
                        element={
                          <CustomRoute minStatus={2}>
                            <Profile />
                          </CustomRoute>
                        }
                      />
                      <Route
                        path='/user/:userId'
                        element={
                          <CustomRoute minStatus={3}>
                            <Profile />
                          </CustomRoute>
                        }
                      />
                      <Route
                        path='/editProfile'
                        element={
                          // <CustomRoute minStatus={1}> add in auth
                          <CustomRoute minStatus={0}>
                            <EditProfile />
                          </CustomRoute>
                        }
                      />
                    </Route>
                  </>
                ) : (
                  <>
                    <Route element={<Authentication />}>
                      <Route
                        path='/login'
                        element={<Login setLogin={setLogin} />}
                      />
                      <Route path='/register' element={<Register />} />
                      <Route
                        path='/verify/:token'
                        element={<Verify setLogin={setLogin} />}
                      />
                      <Route
                        path='/forgot_password'
                        element={<ForgotPassword />}
                      />
                      <Route path='/reset/:token' element={<ResetPassword />} />
                      <Route path='*' element={<Login setLogin={setLogin} />} />
                    </Route>
                  </>
                )}
              </Routes>
            </main>
            {login && <Footer />}
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
