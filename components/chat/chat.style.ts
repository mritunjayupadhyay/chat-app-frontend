import cntl from "cntl";

const getGridForAttachment = (attachmentCount: number): string => {
    return attachmentCount === 1 
        ? " grid-cols-1" 
        : attachmentCount === 2 
            ? " grid-cols-2" 
            : attachmentCount >= 3 
                ? " grid-cols-3" 
                : "";
}

export const classes = {
    chatItemButtonContainer: (unreadCount: number, isActive: boolean) => cntl`
    group p-4 my-2 flex justify-between gap-3
    items-start cursor-pointer rounded-3xl 
    hover:bg-secondary
    ${
        isActive ? "border-[1px] border-zinc-500 bg-secondary" : "bg-bgInput"
    }
    ${unreadCount > 0
    ? "border-[1px] border-success bg-success/20 font-bold"
    : ""}
    `,
    chatItemButtonText: (openOptions: boolean) => cntl`
    "z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary",
    ${openOptions ? "block" : "hidden"}
    `,
    participentAvatar: (i: number) => cntl`
    "w-7 h-7 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark group-hover:outline-secondary",
    ${
        i === 0
            ? "left-0 z-[3]"
            : i === 1
            ? "left-2.5 z-[2]"
            : i === 2
            ? "left-[18px] z-[1]"
            : ""
    }
    `,
    messageItemContainer: (isOwnMessage: boolean) => cntl`
    flex justify-start items-end gap-3 max-w-[220px] sm:max-w-[300px] min-w-
    ${isOwnMessage ? "ml-auto" : ""}
    `,
    messageItemImg: (isOwnMessage: boolean) => cntl`
    h-8 w-8 object-cover rounded-full flex flex-shrink-0
    ${isOwnMessage ? "order-2" : "order-1"}
    `,
    messageItemGroupChatContainer: (isOwnMessage: boolean) => cntl`
    p-4 rounded-3xl flex flex-col
    ${isOwnMessage 
        ? "order-1 rounded-br-none bg-bgMyMessage" 
        : "order-2 rounded-bl-none bg-byIncomingMessage"
    }
    `,
    messageItemGroupChatText: (isEven: boolean) => cntl`
    text-xs font-semibold mb-2
    ${isEven ? "text-success" : "text-danger"}
    `,
    messageItemAttachmentContainer: (attachmentCount: number, isContent: boolean) => cntl`
    grid max-w-7xl gap-2
    ${getGridForAttachment(attachmentCount)}
    ${isContent ? "mb-6" : ""}
    `,
    messageItemContentAttachmentCount: (isOwnMessage: boolean) => cntl`
    mt-1.5 self-end text-[10px] inline-flex items-center
    ${isOwnMessage ? "text-zinc-50" : "text-zinc-400"}
    `,
    addChatModalSwitchContainer: (isGroupChat: boolean) => cntl`
    relative outline outline-[1px] outline-white inline-flex 
    h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
    border-2 border-transparent transition-colors duration-200 
    ease-in-out focus:ring-0
    ${isGroupChat ? "bg-secondary" : "bg-zinc-200"}
    `,
    addChatModalSwitch: (isGroupChat: boolean) => cntl`
    pointer-events-none inline-block h-5 w-5 transform 
    rounded-full shadow ring-0 transition duration-200 
    ease-in-out
    ${isGroupChat ? "translate-x-5 bg-success" : "translate-x-0 bg-white"}
    `,
    addChatModalSwitchLabel: (isGroupChat: boolean) => cntl`
    font-medium text-white
    ${isGroupChat ? "" : "opacity-40"}
    `
}