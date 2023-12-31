import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Input from './input'
import ProfileImage from './ProfileImage'

type PropTypes = {
    closeProfile: () => void
}
const Profile = ({ closeProfile }: PropTypes) => {
    const [name, setName] = useState('') // For local search functionality

    return (
        <>
            <div className="p-4 sticky top-0 bg-secondary z-20 flex justify-between items-center w-full border-borderColor">
                <div className="flex justify-start items-center w-max gap-3">
                    <button
                        onClick={closeProfile}
                        className="rounded-xl border-none bg-transparent text-white flex flex-shrink-0"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-white" />
                    </button>
                    <h1 className='font-bold'>Profile</h1>
                </div>
            </div>
            <div className="bg-bgPrimary w-full relative py-6 px-4">
                <ProfileImage />
                        <div className='py-14'>
                        <Input
                            placeholder="Search or start new chat"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value.toLowerCase()
                                )
                            }
                            className="py-3 px-4 rounded-md w-full"
                        />
                        </div>
            </div>
        </>
    )
}

export default Profile
