"use client";
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = (user) => {
    setIsChatOpen((prevState) => {
      const newState = prevState !== user; // If the user is different, open the chat; otherwise, close it.
      console.log("Chat toggled, new state:", newState);
      return newState;
    });
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};
