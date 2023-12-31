'use client'
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import Input from "@/components/input";
import {Button} from "@/components/button";


export const runtime = 'edge';
const Login = () => {
    // State to manage input data (username and password)
    const [data, setData] = useState({
      username: "",
      password: "",
    });
  
    // Accessing the login function from the AuthContext
    const { login } = useAuth();
  
    // Function to update state when input data changes
    const handleDataChange =
      (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
          ...data,
          [name]: e.target.value,
        });
      };
  
    // Function to handle the login process
    const handleLogin = async () => await login(data);
  
    return (
      <div className="flex justify-center items-center flex-col h-screen w-screen">
        <div className="max-w-5xl w-[95%] sm:w-1/2 p-4 sm:p-8 flex justify-center items-center gap-5 flex-col bg-secondary shadow-md rounded-2xl my-16 border-secondary border-[1px]">
          <h1 className="inline-flex text-white items-center text-2xl mb-4 flex-col">
             Login
          </h1>
          {/* Input for entering the username */}
          <Input
            placeholder="Enter the username..."
            value={data.username}
            onChange={handleDataChange("username")}
          />
          {/* Input for entering the password */}
          <Input
            placeholder="Enter the password..."
            type="password"
            value={data.password}
            onChange={handleDataChange("password")}
          />
          {/* Button to initiate the login process */}
          <Button
            disabled={Object.values(data).some((val) => !val)}
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
          {/* Link to the registration page */}
          <small className="text-zinc-300">
            Don&apos;t have an account?{" "}
            <Link className="text-primary hover:underline" href="/register">Register</Link>
          </small>
        </div>
      </div>
    );
  };
  
  export default Login;