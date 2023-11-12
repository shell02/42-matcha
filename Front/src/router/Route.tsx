import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/context/useAuth'

interface RouteProps {
  children: React.ReactNode
  minStatus?: number
}

const CustomRoute = ({ children, minStatus = 0 }: RouteProps) => {
  const { status } = useAuth()
  if (status < minStatus) return <Navigate to='/editProfile' />
  return children
}

export default CustomRoute
