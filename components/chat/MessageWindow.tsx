import Image from "next/image";
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import { ChatListItemInterface, ChatMessageInterface } from '@/interfaces/chat.interface'
import { getChatObjectMetadata } from '@/utils/chat.utils'
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    XCircleIcon,
} from '@heroicons/react/20/solid'
import cntl from 'cntl'
import { use, useEffect, useRef, useState } from 'react'
import Typing from './Typing'
import { requestHandler } from '@/utils/requestHandler.utils'
import { sendMessage } from '@/apihandler/chat.api'
import { STOP_TYPING_EVENT, TYPING_EVENT } from '@/app/chat/page'
import MessageItem from './MessageItem'
import Input from '../input'
import { upload } from '@/apihandler/upload.api'

const classes = {
    participantsAvatar: (i: number) => cntl`
    w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark
    ${
        i === 0
            ? 'left-0 z-30'
            : i === 1
              ? 'left-2 z-20'
              : i === 2
                ? 'left-4 z-10'
                : ''
    }`,
    messageWindow: (count: number) => cntl`
    p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full bg-bgPrimary
    ${count > 0 ? 'h-[calc(100vh-336px)]' : 'h-[calc(100vh-176px)]'}
    `,
}

type PropTypes = {
    currentChat: ChatListItemInterface
    closeMessageWindow: () => void;
    loadingMessages: boolean;
    messages: ChatMessageInterface[];
    sendChatMessageHandler: (data: ChatMessageInterface) => void;
    isConnected: boolean;
    isTyping: boolean
}

const MessageWindow = ({ 
    currentChat, closeMessageWindow, loadingMessages,
    messages, sendChatMessageHandler, isConnected, isTyping
 }: PropTypes) => {
    const { user } = useAuth()
    const { socket } = useSocket()

        // To keep track of the setTimeout function
        const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const [selfTyping, setSelfTyping] = useState(false) // To track if the current user is typing

    const [message, setMessage] = useState('') // To store the currently typed message
    const [localSearchQuery, setLocalSearchQuery] = useState('') // For local search functionality

    const [attachedFilesUrl, setAttachedFilesUrl] = useState<string[]>([]) // To store files attached to messages

    useEffect(() => {
        setMessage('') // Clear Message Input
    }, [currentChat?._id])

    // Function to send a chat message
    const sendChatMessage = async () => {
        console.log('sendChatMessage', message, attachedFilesUrl)
        // If no current chat ID exists or there's no socket connection, exit the function
        if (!currentChat?._id || !socket) return

        // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
        socket.emit(STOP_TYPING_EVENT, currentChat?._id)

        // Use the requestHandler to send the message and handle potential response or error
        await requestHandler(
            // Try to send the chat message with the given message and attached files
            async () =>
                await sendMessage(
                    currentChat?._id || '', // Chat ID or empty string if not available
                    message, // Actual text message
                    attachedFilesUrl // Any attached files
                ),
            null,
            // On successful message sending, clear the message input and attached files, then update the UI
            (res) => {
                setMessage('') // Clear the message input
                setAttachedFilesUrl([]) // Clear the list of attached files
                sendChatMessageHandler(res.data) // Update the UI with the new message
            },

            // If there's an error during the message sending process, raise an alert
            alert
        )
    }

    const handleAttachmentClick = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            if (e.target.files) {
                const urls = await Promise.all(
                    Array.from(e.target.files).map(async (file) => {
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
                        console.log('url', file.name, url, objectKey)
                        return url
                    })
                )

                console.log('urls', urls)
                // setAttachedFilesUrl(urls)
                setAttachedFilesUrl((prev) => [...urls, ...prev])
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update the message state with the current input value
        setMessage(e.target.value)

        // If socket doesn't exist or isn't connected, exit the function
        if (!socket || !isConnected) return

        // Check if the user isn't already set as typing
        if (!selfTyping) {
            // Set the user as typing
            setSelfTyping(true)

            // Emit a typing event to the server for the current chat
            socket.emit(TYPING_EVENT, currentChat?._id)
        }

        // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Define a length of time (in milliseconds) for the typing timeout
        const timerLength = 3000

        // Set a timeout to stop the typing indication after the timerLength has passed
        typingTimeoutRef.current = setTimeout(() => {
            // Emit a stop typing event to the server for the current chat
            socket.emit(STOP_TYPING_EVENT, currentChat?._id)

            // Reset the user's typing state
            setSelfTyping(false)
        }, timerLength)
    }
    return (
        <>
            <div className="p-4 sticky top-0 bg-secondary z-20 flex justify-between items-center w-full border-borderColor">
                <div className="flex justify-start items-center w-max gap-3">
                    <button
                        onClick={closeMessageWindow}
                        className="rounded-xl border-none bg-transparent text-white flex flex-shrink-0"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-white" />
                    </button>
                    {currentChat?.isGroupChat ? (
                        <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
                            {currentChat?.participants
                                .slice(0, 3)
                                .map((participant, i) => {
                                    return (
                                        // <img
                                        //     key={participant._id}
                                        //     src={participant.avatar}
                                        //     className={classes.participantsAvatar(
                                        //         i
                                        //     )}
                                        // />
                                        <Image
                                            key={participant._id}
                                            alt="participant profile picture"
                                            src={participant.avatar}
                                            width={56}
                                            height={56}
                                            style={{objectFit: "cover"}}
                                            className={classes.participantsAvatar(i)}
                                        />
                                    )
                                })}
                        </div>
                    ) : (
                        <Image
                            alt="chat person profile picture"
                            src={getChatObjectMetadata(currentChat, user!).avatar}
                            width={56}
                            height={56}
                            style={{objectFit: "cover"}}
                            className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                        />
                    )}
                    <div>
                        <p className="font-bold">
                            {getChatObjectMetadata(currentChat, user!).title}
                        </p>
                        <small className="text-zinc-400">
                            {
                                getChatObjectMetadata(currentChat, user!)
                                    .description
                            }
                        </small>
                    </div>
                </div>
            </div>
            <div
                className={classes.messageWindow(attachedFilesUrl.length)}
                id="message-window"
            >
                {attachedFilesUrl.length > 0 ? (
                    <div className="grid gap-4 grid-cols-5 p-4 justify-start max-w-fit border-[0.1px] border-secondary">
                        {attachedFilesUrl.map((fileUrl, i) => {
                            return (
                                <div
                                    key={i}
                                    className="group w-32 h-32 relative aspect-square rounded-xl cursor-pointer"
                                >
                                    <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                                        <button
                                            onClick={() => {
                                                setAttachedFilesUrl(
                                                    attachedFilesUrl.filter(
                                                        (_, ind) => ind !== i
                                                    )
                                                )
                                            }}
                                            className="absolute -top-2 -right-2"
                                        >
                                            <XCircleIcon className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                    <Image
                                    alt="chat person profile picture"
                                    src={fileUrl}                            
                                    fill
                                    style={{objectFit: "cover"}}
                                    className="h-full rounded-xl w-full object-cover"
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : null}
                {loadingMessages ? (
                    <div className="flex justify-center items-center h-[calc(100%-88px)]">
                        <Typing />
                    </div>
                ) : (
                    <>
                        {isTyping ? <Typing /> : null}
                        {messages?.map((msg) => {
                            return (
                                <MessageItem
                                    key={msg._id}
                                    isOwnMessage={msg.sender?._id === user?._id}
                                    isGroupChatMessage={
                                        currentChat?.isGroupChat
                                    }
                                    message={msg}
                                />
                            )
                        })}
                    </>
                )}
            </div>

            <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] bg-secondary border-secondary">
                <input
                    hidden
                    id="attachments"
                    type="file"
                    value=""
                    multiple
                    max={5}
                    onChange={handleAttachmentClick}
                />
                <label
                    htmlFor="attachments"
                    className="p-2 sm:p-4 rounded-full bg-bgInput hover:bg-bgPrimary"
                >
                    <PaperClipIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </label>

                <Input
                    placeholder="Message"
                    value={message}
                    onChange={handleOnMessageChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendChatMessage()
                        }
                    }}
                    className="bg-bgInput"
                />
                <button
                    onClick={sendChatMessage}
                    disabled={!message && attachedFilesUrl.length <= 0}
                    className="p-2 sm:p-4 rounded-full bg-bgInput hover:bg-bgPrimary disabled:opacity-50"
                >
                    <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </>
    )
}
export default MessageWindow
