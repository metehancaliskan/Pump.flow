import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/blocks/header";
import { Button } from "@/components/ui/button";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <div className="">
              <Header />
              {children}
            </div>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
