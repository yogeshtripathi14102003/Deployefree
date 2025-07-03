import React from 'react'
import { useAuth } from '../Context/AuthContext '
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
 const {user, loading} = useAuth()
  if(loading){
    return <div> Loding.....</div>
  }
  return user ? children :<Navigate to="/login" />
}

export default PrivateRoute




// step firest user login or not 
