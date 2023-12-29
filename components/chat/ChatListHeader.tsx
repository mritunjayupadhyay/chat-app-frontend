import { useAuth } from "@/context/AuthContext";
import Avatar from "../Avatar";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { useOpenChat } from "@/context/AddChatContext";

export const ChatListHeader = () => {
    const { user } = useAuth()
    const { setOpenAddChat} = useOpenChat()

    return (
        <div className="p-4 sticky top-0 bg-secondary z-0 flex justify-between items-center w-full border-borderColor">
        <div className="flex justify-start items-center w-max gap-3">
            {user ? <Avatar
            imageUrl={user?.avatar || ""}
            name={user?.name || ""}
            classNames="h-12 w-12 rounded-full flex flex-shrink-0 object-cover"
            /> : null}
            <div>
                <p className="font-bold">{user?.username}</p>
                <small className="text-zinc-400">
                    {user?.name}
                </small>
            </div>
        </div>

        <button
            onClick={() => setOpenAddChat(true)}
            className="rounded-xl border-none bg-transparent text-white py-3 px-5 flex flex-shrink-0"
        >
            <UserPlusIcon className="h-6 w-6 text-white" />
        </button>
    </div>
    )
}

export default ChatListHeader;