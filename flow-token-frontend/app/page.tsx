"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTokenDialog from "@/components/blocks/create-token-dialog";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { contract_abi } from "@/abi/TokenFactoryAbi";
import { flowTestnet } from "viem/chains";
import ProjectCarc from "@/components/blocks/project-card";

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tokens } = useReadContract<any, any, Array<any>>({
    abi: contract_abi,
    address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
    chainId: flowTestnet.id,
    functionName: "getAllMemeTokens",
  });

  const isSearch = (token: any) => {
    const query = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.creatorAddress.toLowerCase().includes(query) ||
      token.tokenAddress.toLowerCase().includes(query) ||
      token.description.toLowerCase().includes(query)
    );
  };

  const tokensArray = Array.isArray(tokens) ? tokens : [];
  const filteredTokens = tokensArray.filter(isSearch);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-2 font-mono text-xs">
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes pixelate {
          0% {
            filter: blur(0px);
          }
          50% {
            filter: blur(1px);
          }
          100% {
            filter: blur(0px);
          }
        }
      `}</style>
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes pixelate {
          0% {
            filter: blur(0px);
          }
          50% {
            filter: blur(1px);
          }
          100% {
            filter: blur(0px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes rainbow {
          0% {
            background-color: #ff0000;
          }
          14% {
            background-color: #ff7f00;
          }
          28% {
            background-color: #ffff00;
          }
          42% {
            background-color: #00ff00;
          }
          57% {
            background-color: #0000ff;
          }
          71% {
            background-color: #8b00ff;
          }
          85% {
            background-color: #ff00ff;
          }
          100% {
            background-color: #ff0000;
          }
        }
      `}</style>

      <main className="space-y-4">
        <div className="text-center relative">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2 animate-[pixelate_2s_ease-in-out_infinite]">
            king of the hill
          </h2>
          <CreateTokenDialog />

          <Card className="max-w-xs mx-auto mt-2 bg-gray-800 border border-green-500">
            <CardContent className="flex items-center space-x-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="Doggo"
                />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <div className="text-[10px]">
                <p className="text-green-400">Created by 2FARar 47m ago</p>
                <p>
                  market cap: 29.67K{" "}
                  <Badge
                    variant="outline"
                    className="ml-1 bg-green-900 text-green-300 text-[8px]"
                  >
                    🚀
                  </Badge>
                </p>
                <p>replies: 34</p>
                <p className="font-bold text-yellow-300">
                  Doggo Real Name [ticker: Rocket]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Input
            className="max-w-xs w-full mr-1 h-6 text-[10px] bg-gray-800 border-green-500 text-green-300 placeholder-green-600"
            placeholder="search for token, address, creator, or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            disabled
            className="h-6 px-2 bg-green-600 hover:bg-green-700 text-black font-bold text-[10px]"
          >
            search
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="h-6 px-2 text-[10px] text-green-400 hover:bg-green-900"
            >
              Following
            </Button>
            <Button
              variant="ghost"
              className="h-6 px-2 text-[10px] text-green-400 border-b border-green-400 hover:bg-green-900"
            >
              Terminal
            </Button>
          </div>
          <Select>
            <SelectTrigger className="w-24 h-6 text-[10px] bg-gray-800 border-green-500 text-green-300">
              <SelectValue placeholder="sort: featured" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-green-500 text-[10px]">
              <SelectItem value="featured">featured</SelectItem>
              <SelectItem value="recent">recent</SelectItem>
              <SelectItem value="popular">popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-gray-800 border border-blue-500">
          <CardContent className="p-2 text-[10px]">
            <p className="text-blue-300">
              The Featured tab shows coins based on several factors, including
              current trends, strong holder base, and similarities to coins you
              have engaged with in the past.
            </p>
            <Button
              variant="outline"
              className="mt-1 h-6 px-2 text-[10px] border-blue-500 text-blue-300 hover:bg-blue-900"
            >
              got it
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-28">
          {Array.isArray(filteredTokens) && filteredTokens.length > 0 ? (
            filteredTokens.map((token: any, index: number) => (
              <ProjectCarc key={index} index={index} token={token} />
            ))
          ) : (
            <p className="text-center text-gray-400">No tokens found</p>
          )}
        </div>
      </main>
    </div>
  );
}
