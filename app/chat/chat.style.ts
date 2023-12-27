import cntl from "cntl";

const classes = {
    participantsAvatar: (i: number) => cntl`
    w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark
    ${
        i === 0
        ? "left-0 z-30"
        : i === 1
        ? "left-2 z-20"
        : i === 2
        ? "left-4 z-10"
        : ""
    }`,
    messageWindow: (count: number) => cntl`
    p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full bg-bgPrimary
    ${
        count > 0
                    ? "h-[calc(100vh-336px)]"
                    : "h-[calc(100vh-176px)]"
    }
    `,
    chatListContainer: (isMessageWindowOpen: boolean) => cntl`
    bg-bgPrimary relative ring-white overflow-y-auto
    w-full sm:w-1/3
    ${isMessageWindowOpen ? "hidden sm:block" : ""}
    `,
    messageWindowContainer: (isMessageWindowOpen: boolean) => cntl`
    border-l-[0.1px] border-borderColor
    w-full sm:w-2/3
    ${isMessageWindowOpen ? "" : "hidden sm:block"}
    `,
}

export { classes}