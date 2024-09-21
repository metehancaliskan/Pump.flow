"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Moon, Sun, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import HowItWorksModal from "./how-it-works-dialog";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative sticky top-0 z-50 w-full h-16 p-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          {/* Hamburger menu for mobile */}
          <Button
            className="flex md:hidden h-6 px-2"
            variant="outline"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Twitter and How It Works buttons for desktop */}
          <div className="hidden md:flex space-x-2">
            <Button
              onClick={() =>
                window.open("https://x.com/flow_blockchain", "_blank")
              }
              variant="outline"
              size="sm"
              className="h-6 px-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              twitter
            </Button>
            <HowItWorksModal />
          </div>
        </div>

        {/* Middle - Marquee */}
        <div className="flex-1 mx-2 md:mx-4 overflow-hidden">
          <div className="relative w-full h-6 overflow-hidden">
            <div className="absolute whitespace-nowrap animate-marquee">
              <Badge
                variant="secondary"
                className="py-0.5 px-1 text-[8px] bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white"
              >
                ENnSCc bought 0.0200 FLOW of baldo • 4KLU76 created Tank on
                09/20/24 • BTC price: $63,235 • FLOW gas: 25 gwei •
              </Badge>
              <Badge
                variant="secondary"
                className="py-0.5 px-1 text-[8px] bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white ml-4"
              >
                ENnSCc bought 0.0200 FLOW of baldo • 4KLU76 created Tank on
                09/20/24 • BTC price: $63,235 • FLOW gas: 25 gwei •
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-6 w-6 p-0 border-gray-300 dark:border-gray-600"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <ConnectKitButton.Custom>
            {({ show, isConnected, truncatedAddress }) => (
              <Button
                variant="outline"
                size="sm"
                onClick={show}
                className="h-6 px-2"
              >
                {isConnected ? truncatedAddress : "Connect"}
              </Button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col p-2 space-y-2">
            <Button
              onClick={() => {
                window.open("https://x.com/flow_blockchain", "_blank");
                setIsMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="h-8 px-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              twitter
            </Button>
            <HowItWorksModal onOpenChange={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
