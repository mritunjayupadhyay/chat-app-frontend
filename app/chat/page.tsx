'use client'
import {
    PaperAirplaneIcon,
    PaperClipIcon,
    UserPlusIcon,
    XCircleIcon,
    ArrowLeftIcon,
} from '@heroicons/react/20/solid'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'

import Input from '@/components/input'
import {
    ChatListItemInterface,
    ChatMessageInterface,
} from '@/interfaces/chat.interface'
import Typing from '@/components/chat/Typing'
import ChatItem from '@/components/chat/ChatItem'
import { classes } from './chat.style'
import { getChatObjectMetadata } from '@/utils/chat.utils'
import MessageItem from '@/components/chat/MessageItem'
import { LocalStorage } from '@/utils/LocalStorage.utils'
import { requestHandler } from '@/utils/requestHandler.utils'

import { getChatMessages, getUserChats, sendMessage } from '../../apihandler/chat.api'
import AddChatModal from '@/components/chat/AddChatModal'
import { upload } from '@/apihandler/upload.api'
import ChatList from '@/components/chat/ChatList'
import MessageWindow from '@/components/chat/MessageWindow'
import { AddChatProvider } from '@/context/AddChatContext'

export const CONNECTED_EVENT = 'connected'
export const DISCONNECT_EVENT = 'disconnect'
export const JOIN_CHAT_EVENT = 'joinChat'
export const NEW_CHAT_EVENT = 'newChat'
export const TYPING_EVENT = 'typing'
export const STOP_TYPING_EVENT = 'stopTyping'
export const MESSAGE_RECEIVED_EVENT = 'messageReceived'
export const LEAVE_CHAT_EVENT = 'leaveChat'
export const UPDATE_GROUP_NAME_EVENT = 'updateGroupName'

export const runtime = 'edge';
const ChatPage = () => {
    const { token } = useAuth()

    const { socket } = useSocket()

    // Create a reference using 'useRef' to hold the currently selected chat.
    // 'useRef' is used here because it ensures that the 'currentChat' value within socket event callbacks
    // will always refer to the latest value, even if the component re-renders.
    const currentChat = useRef<ChatListItemInterface | null>(null)

    // Define state variables and their initial values using 'useState'
    const [isConnected, setIsConnected] = useState(false) // For tracking socket connection

    const [openAddChat, setOpenAddChat] = useState(false) // To control the 'Add Chat' modal
    const [loadingChats, setLoadingChats] = useState(false) // To indicate loading of chats
    const [loadingMessages, setLoadingMessages] = useState(false) // To indicate loading of messages

    const [chats, setChats] = useState<ChatListItemInterface[]>([]) // To store user's chats
    const [messages, setMessages] = useState<ChatMessageInterface[]>([]) // To store chat messages
    const [unreadMessages, setUnreadMessages] = useState<
        ChatMessageInterface[]
    >([]) // To track unread messages

    const [isTyping, setIsTyping] = useState(false) // To track if someone is currently typing
    const [isMessageWindowOpen, setMessageWindowOpen] = useState(false) // To track if the message window is open

    /**
     *  A  function to update the last message of a specified chat to update the chat list
     */
    const updateChatLastMessage = (
        chatToUpdateId: string,
        message: ChatMessageInterface // The new message to be set as the last message
    ) => {
        // Search for the chat with the given ID in the chats array
        const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!

        // Update the 'lastMessage' field of the found chat with the new message
        chatToUpdate.lastMessage = message

        // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
        chatToUpdate.updatedAt = message?.updatedAt

        // Update the state of chats, placing the updated chat at the beginning of the array
        setChats([
            chatToUpdate, // Place the updated chat first
            ...chats.filter((chat) => chat._id !== chatToUpdateId), // Include all other chats except the updated one
        ])
    }

    const sendChatMessageHandler = (data: ChatMessageInterface) => {
        setMessages((prev) => [data, ...prev]) // Update messages in the UI
        updateChatLastMessage(currentChat.current?._id || '', data) // Update the last message in the chat
    }

    const getChats = async () => {
        requestHandler(
            async () => await getUserChats(),
            setLoadingChats,
            (res) => {
                const { data } = res
                console.log('the chats', data)
                setChats(data || [])
            },
            alert
        )
    }

    const getMessages = async () => {
        // Check if a chat is selected, if not, show an alert
        if (!currentChat.current?._id) return alert('No chat is selected')

        // Check if socket is available, if not, show an alert
        if (!socket) return alert('Socket not available')

        // Emit an event to join the current chat
        socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id)

        // Filter out unread messages from the current chat as those will be read
        setUnreadMessages(
            unreadMessages.filter(
                (msg) => msg.chat !== currentChat.current?._id
            )
        )

        // Make an async request to fetch chat messages for the current chat
        requestHandler(
            // Fetching messages for the current chat
            async () => await getChatMessages(currentChat.current?._id || ''),
            // Set the state to loading while fetching the messages
            setLoadingMessages,
            // After fetching, set the chat messages to the state if available
            (res) => {
                const { data } = res
                setMessages(data || [])
                setMessageWindowOpen(true)
            },
            // Display any error alerts if they occur during the fetch
            alert
        )
    }


    const onConnect = () => {
        setIsConnected(true)
    }

    const onDisconnect = () => {
        setIsConnected(false)
    }

    /**
     * Handles the "typing" event on the socket.
     */
    const handleOnSocketTyping = (chatId: string) => {
        // Check if the typing event is for the currently active chat.
        if (chatId !== currentChat.current?._id) return

        // Set the typing state to true for the current chat.
        setIsTyping(true)
    }

    /**
     * Handles the "stop typing" event on the socket.
     */
    const handleOnSocketStopTyping = (chatId: string) => {
        // Check if the stop typing event is for the currently active chat.
        if (chatId !== currentChat.current?._id) return

        // Set the typing state to false for the current chat.
        setIsTyping(false)
    }

    /**
     * Handles the event when a new message is received.
     */
    const onMessageReceived = (message: ChatMessageInterface) => {
        // Check if the received message belongs to the currently active chat
        if (message?.chat !== currentChat.current?._id) {
            // If not, update the list of unread messages
            setUnreadMessages((prev) => [message, ...prev])
        } else {
            // If it belongs to the current chat, update the messages list for the active chat
            setMessages((prev) => [message, ...prev])
        }

        // Update the last message for the chat to which the received message belongs
        updateChatLastMessage(message.chat || '', message)
    }

    const onNewChat = (chat: ChatListItemInterface) => {
        setChats((prev) => [chat, ...prev])
    }

    // This function handles the event when a user leaves a chat.
    const onChatLeave = (chat: ChatListItemInterface) => {
        // Check if the chat the user is leaving is the current active chat.
        if (chat._id === currentChat.current?._id) {
            // If the user is in the group chat they're leaving, close the chat window.
            currentChat.current = null
            // Remove the currentChat from local storage.
            LocalStorage.remove('currentChat')
        }
        // Update the chats by removing the chat that the user left.
        setChats((prev) => prev.filter((c) => c._id !== chat._id))
    }

    // Function to handle changes in group name
    const onGroupNameChange = (chat: ChatListItemInterface) => {
        // Check if the chat being changed is the currently active chat
        if (chat._id === currentChat.current?._id) {
            // Update the current chat with the new details
            currentChat.current = chat

            // Save the updated chat details to local storage
            LocalStorage.set('currentChat', chat)
        }

        // Update the list of chats with the new chat details
        setChats((prev) => [
            // Map through the previous chats
            ...prev.map((c) => {
                // If the current chat in the map matches the chat being changed, return the updated chat
                if (c._id === chat._id) {
                    return chat
                }
                // Otherwise, return the chat as-is without any changes
                return c
            }),
        ])
    }

    useEffect(() => {
        // If the socket isn't initialized, we don't set up listeners.

        // Fetch the chat list from the server.
        // if (!token) {
        //     console.log("No token found", token, user)
        //     router.replace('/login')
        //     return;
        // }
        getChats()
        if (!socket) return

        // Retrieve the current chat details from local storage.
        const _currentChat = LocalStorage.get('currentChat')

        
        // If there's a current chat saved in local storage:
        if (_currentChat) {
            // Set the current chat reference to the one from local storage.
            currentChat.current = _currentChat
            // If the socket connection exists, emit an event to join the specific chat using its ID.
            socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id)
            // Fetch the messages for the current chat.
            getMessages()
        }
        // An empty dependency array ensures this useEffect runs only once, similar to componentDidMount.
    }, [socket, token])

    // This useEffect handles the setting up and tearing down of socket event listeners.
    useEffect(() => {
        // If the socket isn't initialized, we don't set up listeners.
        if (!socket) return

        // Set up event listeners for various socket events:
        // Listener for when the socket connects.
        socket.on(CONNECTED_EVENT, onConnect)
        // Listener for when the socket disconnects.
        socket.on(DISCONNECT_EVENT, onDisconnect)
        // Listener for when a user is typing.
        socket.on(TYPING_EVENT, handleOnSocketTyping)
        // Listener for when a user stops typing.
        socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping)
        // Listener for when a new message is received.
        socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived)
        // Listener for the initiation of a new chat.
        socket.on(NEW_CHAT_EVENT, onNewChat)
        // Listener for when a user leaves a chat.
        socket.on(LEAVE_CHAT_EVENT, onChatLeave)
        // Listener for when a group's name is updated.
        socket.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange)

        // When the component using this hook unmounts or if `socket` or `chats` change:
        return () => {
            // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
            socket.off(CONNECTED_EVENT, onConnect)
            socket.off(DISCONNECT_EVENT, onDisconnect)
            socket.off(TYPING_EVENT, handleOnSocketTyping)
            socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping)
            socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived)
            socket.off(NEW_CHAT_EVENT, onNewChat)
            socket.off(LEAVE_CHAT_EVENT, onChatLeave)
            socket.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange)
        }

        // Note:
        // The `chats` array is used in the `onMessageReceived` function.
        // We need the latest state value of `chats`. If we don't pass `chats` in the dependency array,
        // the `onMessageReceived` will consider the initial value of the `chats` array, which is empty.
        // This will not cause infinite renders because the functions in the socket are getting mounted and not executed.
        // So, even if some socket callbacks are updating the `chats` state, it's not
        // updating on each `useEffect` call but on each socket call.
    }, [socket, chats])

    return (
        <AddChatProvider>
            <AddChatModal
                onSuccess={() => {
                    getChats()
                }}
            />
            <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0 overflow-hidden">
                <div className={classes.chatListContainer(isMessageWindowOpen)}>
                    <ChatList 
                        openAddChat={() => setOpenAddChat(true)} 
                        loadingChats={loadingChats}
                        chats={chats}
                        currentChat={currentChat.current}
                        unreadMessages={unreadMessages}
                        selectChat={(chat) => {
                            if (
                                currentChat.current?._id &&
                                currentChat.current?._id ===
                                    chat._id
                            )
                                return
                            LocalStorage.set(
                                'currentChat',
                                chat
                            )
                            currentChat.current = chat
                            getMessages()
                        }}
                        deleteChat={(chatId) => {
                            setChats((prev) =>
                                prev.filter(
                                    (chat) =>
                                        chat._id !== chatId
                                )
                            )
                            if (
                                currentChat.current?._id ===
                                chatId
                            ) {
                                currentChat.current = null
                                LocalStorage.remove(
                                    'currentChat'
                                )
                            }
                        }}
                    />
                    
                </div>
                <div
                    className={classes.messageWindowContainer(
                        isMessageWindowOpen
                    )}
                >
                    {currentChat.current && currentChat.current?._id ? (
                        <MessageWindow 
                        currentChat={currentChat.current} 
                        closeMessageWindow={() => {
                            currentChat.current = null
                            LocalStorage.remove('currentChat')
                            setMessageWindowOpen(false)
                        }}
                        loadingMessages={loadingMessages}
                        messages={messages}
                        sendChatMessageHandler={sendChatMessageHandler}
                        isConnected={isConnected}
                        isTyping={isTyping}
                        />
                    ) : (
                        <div className="w-full bg-bgPrimary h-full flex justify-center items-center">
                            No chat selected
                        </div>
                    )}
                </div>
            </div>
        </AddChatProvider>
    )
}

export default ChatPage
