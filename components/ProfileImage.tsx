import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'
import {
    MagnifyingGlassPlusIcon,
    PencilSquareIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { upload } from '@/apihandler/upload.api'
import Loading from './loading'
import { Button } from './button'
import { requestHandler } from '@/utils/requestHandler.utils'
import { updateUserProfile } from '@/apihandler/user.api'

const classes = {
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
}

const ProfileImage = () => {
    const { user, updateUserData } = useAuth()
    const [viewPhoto, setViewPhoto] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [profilePic, setProfilePic] = useState<string>(user?.avatar || '')
   
    useEffect(() => {
        setProfilePic(user?.avatar || '')
    }, [user])


    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        console.log('handleFileSelect', e.target.files)
        if (e.target.files) {
            setIsLoading(true)
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
            console.log('url', url);
           
            await updateUserData(user.username, { avatar: url})
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            {viewPhoto ? (
                <div className="w-full m-auto z-50 p-8 overflow-hidden  fixed flex justify-center items-center">
                    <XMarkIcon
                        className="fixed top-5 right-5 w-9 h-9 text-white cursor-pointer"
                        onClick={() => setViewPhoto(false)}
                    />
                    <Image
                        alt={'Profile Pic'}
                        src={profilePic}
                        width={200}
                        height={200}
                        quality={100}
                        style={{ objectFit: 'contain' }}
                        className="h-full w-full object-cover"
                    />
                </div>
            ) : null}
            <div className="profile-image">
                <div className="w-48 h-48 group m-auto cursor-pointer relative">
                    <Avatar
                        imageUrl={profilePic || ''}
                        name={user?.name || 'USER'}
                        classNames="w-48 h-48 text-xl rounded-full flex flex-shrink-0 object-cover"
                    />
                    <div className="absolute transition ease-out duration-300 px-4 items-center 
                    justify-around rounded-full inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 
                    hidden group-hover:flex">
                     <Button
                        onClick={() => setViewPhoto(true)}
                        className="rounded-xl border-none bg-transparent hover:bg-transparent active:bg-transparent text-white py-3 px-3 flex flex-shrink-0"
                    >
                    <MagnifyingGlassPlusIcon className="h-6 w-6 text-white " />
                    </Button>
                    <div
                        className="rounded-xl border-none bg-transparent text-white py-3 px-3 flex flex-shrink-0"
                    >
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
                        className="w-full flex justify-center cursor-pointer p-2 sm:p-4 rounded-full bg-transparent"
                    >
                        <PencilSquareIcon className="h-6 w-6 text-white " />
                    </label>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileImage
