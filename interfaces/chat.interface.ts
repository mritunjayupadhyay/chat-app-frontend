import { UserInterface } from "./user.interface";

export interface ChatListItemInterface {
  admin: string;
  createdAt: string;
  isGroupChat: true;
  lastMessage?: ChatMessageInterface;
  name: string;
  participants: UserInterface[];
  updatedAt: string;
  _id: string;
}

export interface ChatMessageInterface {
    _id: string;
    sender: Pick<UserInterface, "_id" | "avatar" | "username">;
    content: string;
    chat: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}