import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TanstackProvider from "@/components/providers/tanstack-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flow Token",
  description: "Flow Token Generation Center (Just Memes :Ppppp)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}
