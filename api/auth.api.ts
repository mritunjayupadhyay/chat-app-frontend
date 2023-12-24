import axios from 'axios'
export const runtime = 'edge';
// Create an Axios instance for API requests
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_API_URL,
    withCredentials: true,
    timeout: 120000,
})

// API functions for different actions
const loginUser = (data: { username: string; password: string }) => {
    return apiClient.post('/users/login', data)
}

const registerUser = (data: {
    name: string
    password: string
    username: string,
    avatar?: string
}) => {
    return apiClient.post('/users/register', data)
}

const logoutUser = () => {
    console.log('logoutUser')
    return apiClient.get('/chats')
}

export { loginUser, registerUser, logoutUser }
