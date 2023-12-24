// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "@/utils/LocalStorage.utils";
// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEVER_API_URL,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
const getAvailableUsers = () => {
  return apiClient.get("/chats/users");
};

const getUserChats = () => {
  return apiClient.get(`/chats`);
};

const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chats/c/${receiverId}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return apiClient.post(`/chats/group`, data);
};

const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chats/group/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chats/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return apiClient.delete(`/chats/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chats/remove/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chats/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chats/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

const sendMessage = (chatId: string, content: string, attachments: string[]) => {
  const data = {
    content: content,
    attachments
  }
  return apiClient.post(`/messages/${chatId}`, data);
};

const runtime = 'edge';
// Export all the API functions
export {
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  getUserChats,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  runtime
};
