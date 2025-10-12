// "use-client";
// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// // Create a context for the socket connection
// export const SocketContext = createContext();
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Replace with your backend URL
// // Hook to use the socket context
// export const useSocket = () => useContext(SocketContext);

// // Socket Provider component
// export const SocketProvider = ({ children }) => {
//   const socketRef = useRef(null); // Reference to store socket instance
//   const [socket, setSocket] = useState(null); // Socket state
//   const [notification, setNotification] = useState([]); // Add notification state here

//   useEffect(() => {
//     // Initialize socket connection on mount
//     // const socketInstance = io(`${BASE_URL}`); // Replace with your backend URL
//     const socketInstance = io(BASE_URL, {
//       transports: ["polling", "websocket"],
//       withCredentials: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//     });
//     socketRef.current = socketInstance;
//     setSocket(socketInstance); // Set socket state

//     // Listen for notifications (assuming the server sends them)
//     socketInstance.on("notification", (newNotification) => {
//       setNotification((prevNotifications) => [
//         ...prevNotifications,
//         newNotification,
//       ]);
//     });

//     // Cleanup on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   // Provide socket instance and notifications through context
//   return (
//     <SocketContext.Provider
//       value={{ socket, socketRef, notification, setNotification }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const socketInstance = io(BASE_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Listen for BOTH notification event names
    socketInstance.on("notification", (newNotification) => {
      console.log("Notification received (notification):", newNotification);
      setNotification((prev) => [...prev, newNotification]);
    });

    // socketInstance.on("receive_notification", (newNotification) => {
    //   console.log(
    //     "Notification received (receive_notification):",
    //     newNotification
    //   );
    //   setNotification((prev) => [...prev, newNotification]);
    // });

    // IMPORTANT: Listen for message events to create notifications
    //   socketInstance.on(
    //     "receive_message",
    //     ({ message, sender, recipient, timestamp, type }) => {
    //       if (type !== "system" && type !== "swap_details") {
    //         const currentPath = window.location.pathname;
    //         const currentRecipient = new URLSearchParams(
    //           window.location.search
    //         ).get("recipient");

    //         // ✅ ADD THIS CHECK - Get current user
    //         const currentUser = JSON.parse(
    //           localStorage.getItem("user") || "{}"
    //         )?.userName;

    //         // ✅ CRITICAL: Don't notify if current user is the sender
    //         if (sender === currentUser) {
    //           console.log("Skipping notification - I sent this message");
    //           return;
    //         }

    //         // Only notify if user is not on messages page viewing this specific chat
    //         if (currentPath !== "/messages" || currentRecipient !== sender) {
    //           const messageNotification = {
    //             _id: `msg_${Date.now()}_${Math.random()}`,
    //             message: `New message from ${sender}: ${message.substring(
    //               0,
    //               50
    //             )}${message.length > 50 ? "..." : ""}`,
    //             sender: sender,
    //             recipient: recipient,
    //             type: "message",
    //             seen: false,
    //             createdAt: timestamp || new Date().toISOString(),
    //           };

    //           console.log("Creating message notification:", messageNotification);
    //           setNotification((prev) => [...prev, messageNotification]);
    //         }
    //       }
    //     }
    //   );
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, socketRef, notification, setNotification }}
    >
      {children}
    </SocketContext.Provider>
  );
};
