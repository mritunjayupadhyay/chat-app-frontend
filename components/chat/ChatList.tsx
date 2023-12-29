import Input from "../input"
import ChatItem from "./ChatItem"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Typing from "./Typing"
import { getChatObjectMetadata } from "@/utils/chat.utils"
import { ChatListItemInterface, ChatMessageInterface } from "@/interfaces/chat.interface"
import ChatListHeader from "./ChatListHeader"

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
           <ChatListHeader />
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