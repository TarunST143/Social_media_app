import React from 'react'
import { Navigate } from 'react-router-dom';

const LoginProtector = ({children}) => {

    if (localStorage.getItem('userToken')){
      return <Navigate to='/' replace /> 
    }
  
    return children;
}

export default LoginProtector;