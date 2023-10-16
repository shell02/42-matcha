import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Login from './pages/Authentication/Login'

import './App.css'
import './colors.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  const [isLogged, setIsLogged] = useState(false)

  return (
    <BrowserRouter>
      {isLogged && <Header />}
      <main>
        <Routes>
          {isLogged ? (
            <>
              <Route path='/' element={<Home />} />
              <Route path='/search' element={<Search />} />
              <Route path='/user' element={<Profile />} />
              <Route path='/user/:userId' element={<Profile />} />
            </>
          ) : (
            <Route path='*' element={<Login />} />
          )}
        </Routes>
      </main>
      {isLogged && <Footer />}
    </BrowserRouter>
  )
}

export default App
