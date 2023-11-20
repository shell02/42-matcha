import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/context/useAuth'

function SocketProvider() {
  const { socket, id } = useAuth()

  useEffect(() => {
    socket.on('identify', () => {
      socket.emit('auth', { id })
    })
    socket.on('likeReceived', (data) => {
      console.log(data)
    })
    socket.on('unlikeReceived', (data) => {
      console.log(data)
    })
    socket.on('likeBackReceived', (data) => {
      console.log(data)
    })
    socket.on('viewReceived', (data) => {
      console.log(data)
    })
  }, [socket, id])

  return (
    <div className='socket'>
      <Outlet />
    </div>
  )
}

export default SocketProvider
