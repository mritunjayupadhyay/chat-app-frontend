'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/input'
import { Button } from '@/components/button'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { upload } from '@/apihandler/upload.api';


export const runtime = 'edge';
const Register = () => {
    // State to manage user registration data
    const [data, setData] = useState({
        name: '',
        username: '',
        password: '',
    })
    const [profilePic, setProfilePic] = useState<string>('')

    // Access the register function from the authentication context
    const { register } = useAuth()

    // Handle data change for input fields
    const handleDataChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            // Update the corresponding field in the data state
            setData({
                ...data,
                [name]: e.target.value,
            })
        }

    // Handle user registration
    const handleRegister = async () => await register({...data, avatar: profilePic})
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const res = await upload({
                name: file.name,
                type: file.type,
            })
            const {
                data: { presignedUrl, objectKey },
                success,
            } = res.data
            if (success !== true) return ''
            // To save images.
            const uploadToR2Response = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            })
            console.log('uploadToR2Response', uploadToR2Response)
            const url = `${process.env.NEXT_PUBLIC_R2_BUCKET_DOMAIN}/${objectKey}`

            setProfilePic(url)
        }
    }

    return (
        // Register form UI
        <div className="flex justify-center items-center flex-col h-screen w-screen">
            <div className="max-w-5xl w-[95%] sm:w-1/2 p-4 sm:p-8 flex justify-center items-center gap-5 flex-col bg-secondary shadow-md rounded-2xl my-16 border-secondary border-[1px]">
                <h1 className="inline-flex text-white items-center text-2xl mb-4 flex-col">
                    Register
                </h1>
                {/* Input fields for username, password, and name, profile pic */}
                {profilePic ? (
                    <div className="w-full flex justify-center py-2">
                        <img src={profilePic} alt="" className="w-24 rounded-full" />
                    </div>
                ) : null}
                <div className="w-full">
                    <input
                        hidden
                        id="attachments"
                        type="file"
                        value=""
                        multiple
                        max={5}
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="attachments"
                        className="w-full flex justify-center p-2 sm:p-4 rounded-full bg-bgInput hover:bg-bgPrimary"
                    >
                        Add Your Profile Pic{' '}
                        <PaperClipIcon className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                    </label>
                </div>
                <Input
                    placeholder="Enter the your name..."
                    value={data.name}
                    onChange={handleDataChange('name')}
                />
                <Input
                    placeholder="Enter the username..."
                    value={data.username}
                    onChange={handleDataChange('username')}
                />
                <Input
                    placeholder="Enter the password..."
                    type="password"
                    value={data.password}
                    onChange={handleDataChange('password')}
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
                    Already have an account?{' '}
                    <Link
                        className="text-primary hover:underline"
                        href="/login"
                    >
                        Login
                    </Link>
                </small>
            </div>
        </div>
    )
}

export default Register
