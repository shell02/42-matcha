import { Outlet } from 'react-router-dom'
import './Authentication.scss'

function Authentication() {
  return (
    <div className='authentication'>
      <div className='logContainer'>
        <Outlet />
      </div>
    </div>
  )
}

export default Authentication
