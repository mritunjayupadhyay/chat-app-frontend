import { ChatMessageInterface } from "@/interfaces/chat.interface";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useState } from "react";
import { classes } from "./chat.style";

const MessageItem: React.FC<{
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  message: ChatMessageInterface;
}> = ({ message, isOwnMessage, isGroupChatMessage }) => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  return (
    <>
      {resizedImage ? (
        <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
          <XMarkIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => setResizedImage(null)}
          />
          <img
            className="w-full h-full object-contain"
            src={resizedImage}
            alt="chat image"
          />
        </div>
      ) : null}
      <div
        className={classes.messageItemContainer(!!isOwnMessage)}
      >
        <img
          src={message.sender?.avatar?.url}
          className={classes.messageItemImg(!!isOwnMessage)}
        />
        <div
          className={classes.messageItemGroupChatContainer(!!isOwnMessage)}
        >
          {isGroupChatMessage && !isOwnMessage ? (
            <p
              className={classes.messageItemGroupChatText(message.sender.username.length % 2 === 0)}
            >
              {message.sender?.username}
            </p>
          ) : null}

          {message?.attachments?.length > 0 ? (
            <div
              className={classes.messageItemAttachmentContainer(message?.attachments?.length || 0, !!message.content)}
            >
              {message.attachments?.map((file) => {
                return (
                  <div
                    key={file._id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <button
                      onClick={() => setResizedImage(file.url)}
                      className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150"
                    >
                      <MagnifyingGlassPlusIcon className="h-6 w-6 text-white" />
                      <a
                        href={file.url}
                        download
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowDownTrayIcon
                          title="download"
                          className="hover:text-zinc-400 h-6 w-6 text-white cursor-pointer"
                        />
                      </a>
                    </button>
                    <img
                      className="h-full w-full object-cover"
                      src={file.url}
                      alt="msg_img"
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {message.content ? (
            <p className="text-sm">{message.content}</p>
          ) : null}
          <p
            className={classes.messageItemContentAttachmentCount(!!isOwnMessage)}
          >
            {message.attachments?.length > 0 ? (
              <PaperClipIcon className="h-4 w-4 mr-2 " />
            ) : null}
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
