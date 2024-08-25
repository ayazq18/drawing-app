import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/fireBase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const initializeUser = (user)=>{
    if(user){
        setUser([...user])
        setUserLoggedIn(true)
    }else{
        setUser(null)
        setUserLoggedIn(false)
    }
    setLoading(false)
  }

  const value = {
    user,
    userLoggedIn,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
