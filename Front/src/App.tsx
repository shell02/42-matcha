import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Search from './pages/Search'
import Profile from './pages/Profile'

import './App.css'
import './colors.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user' element={<Profile />} />
          <Route path='/user/:userId' element={<Profile />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
