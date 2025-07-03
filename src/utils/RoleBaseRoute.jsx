import React from 'react'
import { useAuth } from '../Context/AuthContext '
import { Navigate } from 'react-router-dom'
const RoleBaseRoute = ({children,requiredRole}) => {
    const {user, loading} = useAuth()

    if(loading){
         return <div> Loading...</div>
    }
    if(!requiredRole.includes(user.role)){
<Navigate to="/UnAuthorized" />
    }       // secendtime checck user role  this route access for admin 
  return user ? children :<Navigate to="/login" />
}

export default RoleBaseRoute


// ths route access requiredRole is admin or user 
