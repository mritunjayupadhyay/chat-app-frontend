import Image from "next/image";
import { UserPlusIcon } from "@heroicons/react/20/solid"
import Input from "../input"
import ChatItem from "./ChatItem"
import { useState } from "react"
import { UserInterface } from "@/interfaces/user.interface"
import { useAuth } from "@/context/AuthContext"
import Typing from "./Typing"
import { getChatObjectMetadata } from "@/utils/chat.utils"
import { ChatListItemInterface, ChatMessageInterface } from "@/interfaces/chat.interface"
import Avatar from "../Avatar";

type PropTypes = {
    openAddChat: () => void;
    loadingChats: boolean;
    chats: ChatListItemInterface[];
    unreadMessages: ChatMessageInterface[];
    currentChat: ChatListItemInterface | null;
    selectChat: (chat: ChatListItemInterface) => void;
    deleteChat: (chatId: string) => void;
}

const ChatList = ({ 
    openAddChat, loadingChats, chats, 
    unreadMessages, currentChat,
    selectChat, deleteChat
}: PropTypes) => {
    const [localSearchQuery, setLocalSearchQuery] = useState('') // For local search functionality
    const { user } = useAuth()
    return (
        <>
            <div className="p-4 sticky top-0 bg-secondary z-0 flex justify-between items-center w-full border-borderColor">
                        <div className="flex justify-start items-center w-max gap-3">
                            {/* <Image
                                alt="profile picture"
                                src={user?.avatar || ''}
                                priority
                                width={56}
                                height={56}
                                style={{objectFit: "cover"}}
                                className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                            /> */}
                            {user ? <Avatar
                            imageUrl={user?.avatar || ""}
                            name={user?.name || ""}
                            classNames="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                            /> : null}
                            {/* <ResizeImage imageUrl={user?.avatar} classNames="h-14 w-14 rounded-full flex flex-shrink-0 object-cover" /> */}
                            <div>
                                <p className="font-bold">{user?.username}</p>
                                <small className="text-zinc-400">
                                    {user?.name}
                                </small>
                            </div>
                        </div>

                        <button
                            onClick={() => openAddChat()}
                            className="rounded-xl border-none bg-transparent text-white py-4 px-5 flex flex-shrink-0"
                        >
                            <UserPlusIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="bg-bgPrimary z-10 w-full sticky top-0 py-4 px-4 flex justify-between items-center gap-4">
                        <Input
                            placeholder="Search or start new chat"
                            value={localSearchQuery}
                            onChange={(e) =>
                                setLocalSearchQuery(
                                    e.target.value.toLowerCase()
                                )
                            }
                            className="py-3 px-4 rounded-md"
                        />
                    </div>
                    <div className="px-4">
                        {loadingChats ? (
                            <div className="flex justify-center items-center h-[calc(100%-88px)]">
                                <Typing />
                            </div>
                        ) : (
                            // Iterating over the chats array
                            [...chats]
                                // Filtering chats based on a local search query
                                .filter((chat) =>
                                    // If there's a localSearchQuery, filter chats that contain the query in their metadata title
                                    localSearchQuery
                                        ? getChatObjectMetadata(chat, user!)
                                              .title?.toLocaleLowerCase()
                                              ?.includes(localSearchQuery)
                                        : // If there's no localSearchQuery, include all chats
                                          true
                                )
                                .map((chat) => {
                                    return (
                                        <ChatItem
                                            chat={chat}
                                            isActive={
                                                chat._id ===
                                                currentChat?._id
                                            }
                                            unreadCount={
                                                unreadMessages.filter(
                                                    (n) => n.chat === chat._id
                                                ).length
                                            }
                                            onClick={() => selectChat(chat)}
                                            key={chat._id}
                                            onChatDelete={() => deleteChat(chat._id)}
                                        />
                                    )
                                })
                        )}
                    </div>
        </>
    )
}

export default ChatList;