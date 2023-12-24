import axios from 'axios'
// Create an Axios instance for API requests
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_API_URL,
    withCredentials: true,
    timeout: 120000,
})

// API functions for different actions
const runtime = 'edge';
const upload = (args: { name: string, type: string }) => {
    const data = {
        fileName: args.name,
		fileType: args.type
    }
    return apiClient.post('/uploads/signed_url', data)
}

export { upload, runtime }
