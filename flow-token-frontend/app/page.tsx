"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CreateTokenDialog from "@/components/blocks/create-token-dialog";
import { useReadContract } from "wagmi";
import { contract_abi } from "@/abi/TokenFactoryAbi";
import { flowTestnet } from "viem/chains";
import ProjectCard from "@/components/blocks/project-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tokens } = useReadContract<any, any, Array<any>>({
    abi: contract_abi,
    address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
    chainId: flowTestnet.id,
    functionName: "getAllMemeTokens",
  });

  const isSearch = useCallback(
    (token: any) => {
      const query = searchQuery.toLowerCase();
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.creatorAddress.toLowerCase().includes(query) ||
        token.tokenAddress.toLowerCase().includes(query) ||
        token.description.toLowerCase().includes(query)
      );
    },
    [searchQuery]
  );

  const tokensArray = Array.isArray(tokens) ? tokens : [];
  const filteredTokens = tokensArray.filter(isSearch);

  const clearSearch = () => setSearchQuery("");

  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 font-mono text-xs">
      {/* Left side - Create Coin Form */}
      <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0 md:overflow-y-auto">
        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 animate-[pixelate_2s_ease-in-out_infinite]">
          Launch Your Crypto Rocket 🚀
        </h2>
        <Card className="bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-500 mb-4">
          <CardContent className="p-4 text-[10px]">
            <p className="text-yellow-600 dark:text-yellow-300 font-bold mb-2">
              🛡️ Rug-Proof Zone 🛡️
            </p>
            <p className="text-blue-600 dark:text-blue-300">
              Our crypto launchpad is like a shield against rug pulls! Every
              token here is a fair-launch gem, with no sneaky presales or team
              allocations. It's the Fort Knox of meme coins! 🏰💎
            </p>
          </CardContent>
        </Card>
        <CreateTokenDialog />
      </div>

      {/* Right side - Token Cards */}
      <div className="w-full md:w-1/3 pl-0 md:pl-4">
        <div className="bg-gray-100 dark:bg-gray-900 z-10 pb-2 sticky top-0">
          <div className="relative w-full mb-4">
            <Input
              className="w-full h-8 text-[10px] bg-white dark:bg-gray-800 border-green-300 dark:border-green-500 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 pr-8"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="md:h-[calc(100vh-8rem)] pr-2">
          <div className="space-y-4 pb-4">
            {Array.isArray(filteredTokens) && filteredTokens.length > 0 ? (
              filteredTokens
                .slice()
                .reverse()
                .map((token: any, index: number) => (
                  <ProjectCard key={token.symbol} index={index} token={token} />
                ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No tokens found
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
