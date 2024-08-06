import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
const { GOOGLE_CLIENT_ID } = process.env;
console.log("🚀 ~ GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wagenge",
  description: "Wagenge FC App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID as string}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
