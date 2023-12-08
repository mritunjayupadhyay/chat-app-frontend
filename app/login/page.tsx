'use client'

import React from 'react';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
    const { logout } = useAuth();

    const handleClick = async () => {
        console.log('login', logout);
          // Accessing the login function from the AuthContext
          await logout();
    }
    return (
        <div>
        <h1>LoginPage</h1>
        <button onClick={handleClick}>login</button>
        </div>
    );
}

export default LoginPage;