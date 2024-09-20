import React from "react";
import { Button } from "../ui/button";
import { MessageCircle, Wallet } from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex justify-between items-center mb-4 text-[10px]">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
        >
          <MessageCircle className="mr-1 h-3 w-3" />
          twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black"
        >
          <MessageCircle className="mr-1 h-3 w-3" />
          telegram
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black"
        >
          how it works
        </Button>
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
      <Button
        variant="outline"
        size="sm"
        className="h-6 px-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
      >
        <Wallet className="mr-1 h-3 w-3" />
        connect wallet
      </Button>
    </header>
  );
};

export default Header;
