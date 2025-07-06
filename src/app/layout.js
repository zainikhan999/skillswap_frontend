import ClientLayout from "./components/clientLayout";
import "./globals.css";
import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/ChatContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Choose weights you need
  variable: "--font-poppins",
});
export const metadata = {
  title: "My App",
  description: "Some description",
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
