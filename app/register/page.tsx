'use client'
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/input";
import Button from "@/components/button";

const Register = () => {
    // State to manage user registration data
    const [data, setData] = useState({
      email: "",
      username: "",
      password: "",
    });
  
    // Access the register function from the authentication context
    const { register } = useAuth();
  
    // Handle data change for input fields
    const handleDataChange =
      (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update the corresponding field in the data state
        setData({
          ...data,
          [name]: e.target.value,
        });
      };
  
    // Handle user registration
    const handleRegister = async () => await register(data);
  
    return (
      // Register form UI
      <div className="flex justify-center items-center flex-col h-screen w-screen">
        <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
          <h1 className="inline-flex text-white items-center text-2xl mb-4 flex-col">
             Register
          </h1>
          {/* Input fields for username, password, and email */}
          <Input
            placeholder="Enter the email..."
            type="email"
            value={data.email}
            onChange={handleDataChange("email")}
          />
          <Input
            placeholder="Enter the username..."
            value={data.username}
            onChange={handleDataChange("username")}
          />
          <Input
            placeholder="Enter the password..."
            type="password"
            value={data.password}
            onChange={handleDataChange("password")}
          />
          {/* Register button */}
          <Button
            fullWidth
            disabled={Object.values(data).some((val) => !val)}
            onClick={handleRegister}
          >
            Register
          </Button>
          {/* Login link */}
          <small className="text-zinc-300">
            Already have an account?{" "}
            <a className="text-primary hover:underline" href="/login">
              Login
            </a>
          </small>
        </div>
      </div>
    );
  };
  
  export default Register;