import type { Metadata } from "next";
import "./globals.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
const { GOOGLE_CLIENT_ID } = process.env;
import { andika } from "@/app/fonts";

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
    <html lang="en" className={andika.className}>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID as string}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
