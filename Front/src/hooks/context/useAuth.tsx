import { useContext } from 'react'
import { AuthContext } from '../../providers/AuthContext'
import { AuthContextType } from '../../utils/types'

const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export default useAuth
