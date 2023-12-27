import cntl from "cntl";

const classes = {
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