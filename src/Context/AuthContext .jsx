
import axios from "axios";
import React, { useState, createContext, useEffect, useContext } from "react";

const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const[loading,setLoading] = useState(true)
  
  useEffect(() => {
    const verifyUser = async () => {

        try {
            const token = localStorage.getItem("token");
            if(!token){
          const response = await axios.get(
            "http://localhost:5000/v1/auth/verify",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            
            } );
            console.log(response)
          if (response.data.success) {
            setUser(response.data.user)
          }

          }else{
            setUser(null);
            setLoading(false)

          }
        } catch (error) {
          console.log(error)
          if (error.response && !error.response.data.success) {
            setUser(null);
          }
        }finally{
          setLoading(false)  // thiss finaly block is response from srever 
        }
      
    }

    verifyUser()
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
export { AuthContext };
