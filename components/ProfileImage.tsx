import { useAuth } from "@/context/AuthContext";
import Avatar from "./Avatar";
import { CameraIcon } from "@heroicons/react/20/solid";

const classes = {
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
}

const ProfileImage = () => {
    const {user} = useAuth();
    return (
        <div className="profile-image">
        <div className="w-48 h-48 group m-auto cursor-pointer relative ">
        <Avatar
        imageUrl={user?.avatar || ''}
        name={user?.name || "USER"}
            classNames="w-48 h-48 text-xl rounded-full flex flex-shrink-0 object-cover"
        />
        <div className="absolute transition ease-out duration-300 px-4  flex-col items-center justify-center rounded-full inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-30 hidden group-hover:flex">
            <CameraIcon className="h-8 w-8 text-white" />
            <p className="text-sm text-center text-white pt-2 uppercase">Change Profile Photo</p>
        </div>
        </div>
        </div>
    );
}

export default ProfileImage;