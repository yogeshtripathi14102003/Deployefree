import React from 'react'
// import{useAuth} from '../Context/AuthContext ';
import AdminSidebar from '../component/AdminSidebar';
import Navbar from '../component/Navbar';
//  import AdminSummary from '../component/AdminSummary';
import { Outlet } from 'react-router-dom';
const AdminDashbord = () => {
  // const {user,} = useAuth()
 
 
  return (
    <>

  <Navbar />

      <AdminSidebar />
 
          {/* <AdminSummary />  */}
      <Outlet />
    
    </>
  )
}

export default AdminDashbord
