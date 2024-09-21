"use client";
import React from "react";
import { Button } from "../ui/button";
import { MessageCircle, Wallet } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import HowItWorksModal from "./how-it-works-dialog";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  return (
    <header className="flex justify-between items-center mb-4 text-[10px]">
      <div className="flex space-x-2">
        <Button
          onClick={()  => window.open("https://x.com/flow_blockchain", "_blank")}
          variant="outline"
          size="sm"
          className="h-6 px-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
        >
          <MessageCircle className="mr-1 h-3 w-3" />
          twitter
        </Button>
        {/* <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black"
        >
          <MessageCircle className="mr-1 h-3 w-3" />
          telegram
        </Button> */}
        <HowItWorksModal />
      </div>
      <div className="flex space-x-2 overflow-hidden">
        <Badge
          variant="secondary"
          className="bg-yellow-400 text-black px-1 py-0.5 text-[8px] whitespace-nowrap animate-[slide_20s_linear_infinite]"
        >
          ENnSCc bought 0.0200 FLOW of baldo • 4KLU76 created Tank on 09/20/24 •
          BTC price: $63,235 • FLOW gas: 25 gwei
        </Badge>
      </div>
      <ConnectKitButton />
    </header>
  );
};

export default Header;
