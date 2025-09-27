// "use client"; // This makes the component a client component

// import { SocketProvider } from "../contexts/SocketContext";
// import Navbar from "../components/navbar";
// export default function ClientLayout({ children }) {
//   return (
//     <SocketProvider>
//       <Navbar />

//       {children}
//     </SocketProvider>
//   );
// }
// "use client"; // This makes the component a client component

// import { SocketProvider } from "../contexts/SocketContext";
// import Sidebar from "../components/navbar"; // Change from Navbar to Sidebar
// import { useAuth } from "../contexts/AuthContext"; // Import useAuth
// import { usePathname } from "next/navigation"; // Import usePathname

// export default function ClientLayout({ children }) {
//   const { user } = useAuth(); // Get user authentication state
//   const pathname = usePathname(); // Get current route

//   // Define routes where sidebar should NOT appear
//   const publicRoutes = ["/", "/login", "/signup"];
//   const shouldShowSidebar = user && !publicRoutes.includes(pathname);

//   return (
//     <SocketProvider>
//       <div className="min-h-screen bg-gray-50">
//         {shouldShowSidebar && <Sidebar />}
//         <main
//           className={`transition-all duration-300 min-h-screen ${
//             shouldShowSidebar ? "lg:ml-72" : ""
//           }`}
//         >
//           <div className="lg:p-0">{children}</div>
//         </main>
//       </div>
//     </SocketProvider>
//   );
// }
// "use client";

// import { SocketProvider } from "../contexts/SocketContext";
// import Sidebar from "../components/navbar";
// import { useAuth } from "../contexts/AuthContext";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// export default function ClientLayout({ children }) {
//   const { user } = useAuth();
//   const pathname = usePathname();
//   const [isCollapsed, setIsCollapsed] = useState(false); // Add this line

//   const publicRoutes = ["/", "/login", "/signup"];
//   const shouldShowSidebar = user && !publicRoutes.includes(pathname);

//   return (
//     <SocketProvider>
//       <div className="min-h-screen bg-gray-50">
//         {shouldShowSidebar && (
//           <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//         )}
//         <main
//           className={`transition-all duration-300 min-h-screen ${
//             shouldShowSidebar ? (isCollapsed ? "lg:ml-20" : "lg:ml-72") : ""
//           }`}
//         >
//           <div className="lg:p-0">{children}</div>
//         </main>
//       </div>
//     </SocketProvider>
//   );
// }
"use client";

import { SocketProvider } from "../contexts/SocketContext";
import Sidebar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ClientLayout({ children }) {
  const { user, loading } = useAuth(); // Add loading
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const publicRoutes = ["/", "/login", "/signup"];
  const shouldShowSidebar = user && !publicRoutes.includes(pathname);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50">
        {shouldShowSidebar && (
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
        <main
          className={`transition-all duration-300 min-h-screen ${
            shouldShowSidebar ? (isCollapsed ? "lg:ml-20" : "lg:ml-72") : ""
          }`}
        >
          <div className="lg:p-0">{children}</div>
        </main>
      </div>
    </SocketProvider>
  );
}
