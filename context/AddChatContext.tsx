'use client'
import React, { createContext, useContext, useState } from "react";


const AddChatContext = createContext<{
    openAddChat: boolean;
    setOpenAddChat: (open: boolean) => void;
}>({
    openAddChat: false,
    setOpenAddChat: () => {},
});

// Create a hook to access the AddChatContext
const useOpenChat = () => useContext(AddChatContext);

const AddChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [openAddChat, setOpenAddChat] = useState(false) // To control the 'Add Chat' modal

  return (
    <AddChatContext.Provider value={{ openAddChat, setOpenAddChat }}>
      {children} 
    </AddChatContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { AddChatContext, AddChatProvider, useOpenChat };
