// import ClientLayout from "./components/clientLayout";
// import "./globals.css";
// import { AuthProvider } from "contexts/AuthContext";
// import { ChatProvider } from "contexts/ChatContext";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"], // Choose weights you need
//   variable: "--font-poppins",
// });
// export const metadata = {
//   title: "Skill Swap",
//   description: "A platform to exchange skills.",
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={poppins.variable}>
//       <body>
//         <AuthProvider>
//           <ChatProvider>
//             <ClientLayout>{children}</ClientLayout>
//           </ChatProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import ClientLayout from "./components/clientLayout";
import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/ChatContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Skill Swap – Connect, Share & Grow",
  description:
    "Skill Swap helps you exchange skills, connect with people, and grow together.",
  openGraph: {
    title: "Skill Swap – Connect, Learn & Grow",
    description:
      "Skill Swap helps you exchange skills, connect with people, and grow together.",
    url: "https://skillswap-frontend-ten.vercel.app/",
    siteName: "Skill Swap",
    images: [
      {
        url: "https://skillswap-frontend-ten.vercel.app/favicon.ico",
        width: 200,
        height: 200,
        alt: "Skill Swap Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Swap – Connect, Learn & Grow",
    description:
      "Join Skill Swap to share knowledge, learn new skills, and connect with talented people.",
    images: ["https://skillswap-frontend-ten.vercel.app/favicon.ico"],
  },
  icons: {
    icon: "/skill_swap.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AuthProvider>
          <ChatProvider>
            <ClientLayout>{children}</ClientLayout>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
