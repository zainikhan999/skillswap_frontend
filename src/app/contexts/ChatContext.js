"use client";
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState(null); // Store username instead of boolean

  const toggleChat = (user) => {
    setActiveChat((prevUser) => {
      const newUser = prevUser === user ? null : user;
      console.log("Active chat changed:", newUser);
      return newUser;
    });
  };

  const closeChat = () => {
    setActiveChat(null);
  };

  return (
    <ChatContext.Provider value={{ activeChat, toggleChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};
