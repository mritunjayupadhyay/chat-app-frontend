import axios from 'axios'
const runtime = 'edge';
// Create an Axios instance for API requests
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_API_URL,
    withCredentials: true,
    timeout: 120000,
})

const updateUserProfile = (username:string,data: {
    name?: string
    avatar?: string
}) => {
    return apiClient.put(`/users/${username}`, data)
}

export { updateUserProfile, runtime }
