import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useAuth } from "@/context/AuthContext";
import Avatar from "../Avatar";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { useOpenChat } from "@/context/AddChatContext";
import Link from 'next/link';
import { Fragment } from 'react';
import { Button } from '../button';

export const ChatListHeader = () => {
    const { user, logout } = useAuth()
    const { setOpenAddChat} = useOpenChat()

    return (
        <div className="p-4 relative top-0 bg-secondary z-10 flex justify-between items-center w-full border-borderColor">
        <div className="flex justify-start items-center w-max gap-3">
            {user ? <Avatar
            imageUrl={user?.avatar || ""}
            name={user?.name || ""}
            classNames="h-12 w-12 rounded-full flex flex-shrink-0 object-cover"
            /> : null}
            <div>
                <p className="font-bold">{user?.username}</p>
                <small className="text-zinc-400">
                    {user?.name}
                </small>
            </div>
        </div>

        <div>
        <button
            onClick={() => setOpenAddChat(true)}
            className="rounded-xl border-none bg-transparent text-white py-3 px-3 flex flex-shrink-0"
        >
            <UserPlusIcon className="h-6 w-6 text-white" />
        </button>
        <div className="w-6 text-right bg-secondary">
        <Menu as="div" className="relative inline-block text-left">
      <div>
      <Menu.Button>
      <EllipsisVerticalIcon className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
      </Menu.Button>
      </div>
      <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-secondary shadow-lg ring-1 ring-black/5 focus:outline-none">
      <div className="py-2 bg-bgInput rounded-md">
      <Menu.Item>
      <div 
        className="text-white cursor-pointer bg-bgInput hover:bg-secondary w-full pl-8 h-12 flex items-center opacity-75 hover:opacity-100"
        onClick={() => console.log("profile")}>
            Profile
        </div>
        </Menu.Item>
        <Menu.Item>
        <div 
        className="text-white cursor-pointer bg-bgInput hover:bg-secondary w-full pl-8 h-12 flex items-center opacity-75 hover:opacity-100"
        onClick={logout}>
            Log out
        </div>
        </Menu.Item>
      </div>
        
        </Menu.Items>
        </Transition>
      
        </Menu>
        </div>
        </div>
    </div>
    )
}

export default ChatListHeader;