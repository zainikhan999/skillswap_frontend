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
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <Head>
        <title>Skill Swap – Connect, Learn & Grow</title>
        <meta
          name="description"
          content="Skill Swap helps you exchange skills, connect with people, and grow together."
        />
        <meta
          property="og:title"
          content="Skill Swap – Connect, Learn & Grow"
        />
        <meta
          property="og:description"
          content="Skill Swap helps you exchange skills, connect with people, and grow together."
        />
        <meta
          property="og:image"
          content="https://skillswap-frontend-ten.vercel.app/skill_swap.png"
        />
        <meta
          property="og:url"
          content="https://skillswap-frontend-ten.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Skill Swap – Connect, Learn & Grow"
        />
        <meta
          name="twitter:description"
          content="Join Skill Swap to share knowledge, learn new skills, and connect with talented people."
        />
        <meta
          name="twitter:image"
          content="https://skillswap-frontend-ten.vercel.app/skill_swap.png"
        />
      </Head>
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
