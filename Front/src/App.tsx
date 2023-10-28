import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Verify from './pages/Authentication/Verify'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import Register from './pages/Authentication/Register'
import Login from './pages/Authentication/Login'
import EditProfile from './pages/EditProfile'
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

function App() {
  const queryClient = new QueryClient()
  const [login, setLogin] = useState<string>(Cookies.get('accessToken') || '')

  useEffect(() => {}, [login])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {login && <Header />}
        <main>
          <Routes>
            {login ? (
              <>
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<Search />} />
                <Route path='/user' element={<Profile />} />
                <Route path='/user/:userId' element={<Profile />} />
                <Route path='/editProfile' element={<EditProfile />} />
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
                  <Route path='/forgot_password' element={<ForgotPassword />} />
                  <Route path='/reset/:token' element={<ResetPassword />} />
                  <Route path='*' element={<Login setLogin={setLogin} />} />
                </Route>
              </>
            )}
          </Routes>
        </main>
        {login && <Footer />}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
