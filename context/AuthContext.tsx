'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Loading from "../components/loading";
import { UserInterface } from "../interfaces/user.interface";
import { requestHandler } from "../utils/requestHandler.utils";
import { loginUser, registerUser, logoutUser } from "@/api/auth.api";
import { LocalStorage } from "@/utils/LocalStorage.utils";

const apiCall = () => Promise.resolve({ data: "Hello World!" });
// Create a context to manage authentication-related data and functions
const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    username: string;
    password: string;
    avatar?: string
  }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter()

  // Function to handle user login
  const login = async (data: { username: string; password: string }) => {
    await requestHandler(
      async () => await loginUser(data),
      setIsLoading,
      (res) => {
        const { data } = res;
        setUser(data.user);
        setToken(data.accessToken);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.accessToken);
        LocalStorage.remove("currentChat");
        router.replace("/chat") // Redirect to the chat page after successful login
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user registration
  const register = async (data: {
    name: string;
    username: string;
    password: string;
    avatar?: string
  }) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        alert("Account created successfully! Go ahead and login.");
        router.replace("/login")// Redirect to the login page after successful registration
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    LocalStorage.clear(); // Clear local storage on logout
    router.replace("/chat")// Redirect to the login page after successful logout
  };

  // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = LocalStorage.get("token");
    const _user = LocalStorage.get("user");
    if (_token && _user?._id) {
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);

  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loading /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { AuthContext, AuthProvider, useAuth };
