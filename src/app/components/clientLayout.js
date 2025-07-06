"use client"; // This makes the component a client component

import { SocketProvider } from "../contexts/SocketContext";
import Navbar from "../components/navbar";
export default function ClientLayout({ children }) {
  return (
    <SocketProvider>
      <Navbar />

      {children}
    </SocketProvider>
  );
}
