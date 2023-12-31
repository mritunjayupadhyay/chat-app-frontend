import Image from 'next/image';
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'
import { CameraIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const classes = {
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
}

const ProfileImage = () => {
    const { user } = useAuth()
    const [viewPhoto, setViewPhoto] = useState<boolean>(false);

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
            src={user?.avatar || ''}  
            width={800}       
            height={800}                   
            style={{objectFit: "contain"}}
            className="h-full w-full object-cover"
        />
      </div>
      ) : null}
      <div className="profile-image">
            <div className="w-48 h-48 group m-auto cursor-pointer relative ">
                <Avatar
                    imageUrl={user?.avatar || ''}
                    name={user?.name || 'USER'}
                    classNames="w-48 h-48 text-xl rounded-full flex flex-shrink-0 object-cover"
                />
                <div className="absolute transition ease-out duration-300 px-4  flex-col items-center justify-center rounded-full inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-30 hidden group-hover:flex">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button>
                                <CameraIcon className="h-8 w-8 text-white m-auto" />
                                <p className="text-sm text-center text-white pt-2 uppercase">
                                    Change Profile Photo
                                </p>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-1/3 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-secondary shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div className="py-2 bg-bgInput rounded-md">
                                    <Menu.Item>
                                        <div
                                            className="text-white uppercase cursor-pointer bg-bgInput hover:bg-secondary w-full pl-8 h-12 flex items-center opacity-75 hover:opacity-100"
                                            onClick={() => setViewPhoto(true)}
                                        >
                                            View Photo
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div
                                            className="text-white uppercase cursor-pointer bg-bgInput hover:bg-secondary w-full pl-8 h-12 flex items-center opacity-75 hover:opacity-100"
                                            onClick={() => console.log('logout')}
                                        >
                                            Change Photo
                                        </div>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
        </>
        
    )
}

export default ProfileImage
