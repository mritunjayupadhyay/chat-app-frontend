import { ChatMessageInterface } from "@/interfaces/chat.interface";
import {
  PaperClipIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { classes } from "./chat.style";
import ResizeImage from "../resizedImage";
import Avatar from "../Avatar";

const MessageItem: React.FC<{
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  message: ChatMessageInterface;
}> = ({ message, isOwnMessage, isGroupChatMessage }) => {
  return (
    <>
      <div
        className={classes.messageItemContainer(!!isOwnMessage)}
      >
        <Avatar
          imageUrl={message.sender?.avatar}
          name={message.sender?.username}
          classNames={classes.messageItemImg(!!isOwnMessage)}
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
              {message.attachments?.map((fileUrl) => {
                return (
                  <div
                    key={fileUrl}
                    className="group aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <ResizeImage imageUrl={fileUrl} classNames="h-full w-full object-cover" />
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
