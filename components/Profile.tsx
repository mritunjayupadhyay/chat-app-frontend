import { ArrowLeftIcon, PencilIcon, CheckIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import Input from './input'
import ProfileImage from './ProfileImage'
import cntl from 'cntl'
import { useAuth } from '@/context/AuthContext'

const classes = {
    inputContainer: (edit: boolean) => cntl`
    border-[#8696a0] flex items-end pt-2 pb-1 px-1
    ${edit ? 'border-b-2' : 'border-0'}
    `,
}

type PropTypes = {
    closeProfile: () => void
}
const Profile = ({ closeProfile }: PropTypes) => {
    const { user, updateUserData } = useAuth()

    const [name, setName] = useState('') // For local search functionality
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setName(user?.name || '')
    }, [user])

    const handleSubmit = async () => {
        console.log("user", user)
        if (!user) return;
        if (edit) {
            await updateUserData(user.username, { name })
        }
        setEdit(!edit)
    }

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
                    <h1 className="font-bold">Profile</h1>
                </div>
            </div>
            <div className="bg-bgPrimary w-full relative py-6 px-5">
                <ProfileImage />
                <div className="py-14">
                    <label className="text-primary text-sm mb-3.5 block font-normal">
                        Your Name
                    </label>
                    <div className={classes.inputContainer(edit)}>
                        <input
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="bg-transparent px-0 py-0 border-0 border-b-1 outline-0 rounded-md w-full"
                        />
                        <button
                            onClick={handleSubmit}
                            className="p-1 border-none bg-transparent text-white flex flex-shrink-0"
                        >
                            {edit ? <CheckIcon className="h-5 w-5 text-[#8696a0]" /> : <PencilIcon className="h-5 w-5 text-[#8696a0]" />}
                        </button>
                    </div>
                </div>
                <div className="py-14">
                    <label className="text-primary text-sm mb-3.5 block font-normal">
                        Your User name
                    </label>
                    <div className={classes.inputContainer(false)}>
                        <input
                            placeholder="Your User Name"
                            value={user?.username}
                            disabled
                            className="bg-transparent px-0 py-0 border-0 border-b-1 outline-0 rounded-md w-full"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
