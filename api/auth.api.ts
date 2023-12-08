import axios from "axios";

// Create an Axios instance for API requests
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_API_URL,
    withCredentials: true,
    timeout: 120000,
  });

  // API functions for different actions
const loginUser = (data: { username: string; password: string }) => {
    return apiClient.post("/chats", data);
  };
  
  const registerUser = (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    return apiClient.post("/chats", data);
  };
  
  const logoutUser = () => {
    console.log("logoutUser");
    return apiClient.get("/chats");
  };

export {
    loginUser,
    registerUser,
    logoutUser
}