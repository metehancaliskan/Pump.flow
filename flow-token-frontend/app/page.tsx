"use client";
import React from "react";
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
import { Bitcoin, Cpu, Crown, Users, Zap } from "lucide-react";
import CreateTokenDialog from "@/components/blocks/create-token-dialog";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
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
            placeholder="search for token"
          />
          <Button className="h-6 px-2 bg-green-600 hover:bg-green-700 text-black font-bold text-[10px]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            {
              name: "Nako",
              ticker: "NAKO",
              description:
                "the most memeable dog on solana. join the nako fam. https://nakofam.xyz/ https://x.com/NakoFamSol https://t.me/nakofamsol",
              image: "/placeholder.svg?height=100&width=100",
              creator: "ASU2ve",
              createdAgo: "23h ago",
              marketCap: "37.98K",
              replies: 459,
              isLiveStreaming: true,
            },
            {
              name: "BitBrew",
              ticker: "BREW",
              description: "Decentralized coffee marketplace",
              image: "/placeholder.svg?height=100&width=100",
              creator: "CoffeeMan",
              createdAgo: "2d ago",
              marketCap: "15.5K",
              replies: 203,
              isLiveStreaming: false,
            },
            {
              name: "NanoNFT",
              ticker: "NNFT",
              description: "Microscopic digital collectibles",
              image: "/placeholder.svg?height=100&width=100",
              creator: "TinyCreator",
              createdAgo: "5h ago",
              marketCap: "22.3K",
              replies: 178,
              isLiveStreaming: true,
            },
            {
              name: "VoxelVerse",
              ticker: "VOX",
              description: "3D voxel metaverse platform",
              image: "/placeholder.svg?height=100&width=100",
              creator: "BlockBuilder",
              createdAgo: "1d ago",
              marketCap: "45.7K",
              replies: 567,
              isLiveStreaming: false,
            },
          ].map((coin, index) => (
            <Card
              onClick={() => {
                router.push(`/token-detail/${coin.ticker}`);
              }}
              key={coin.ticker}
              className={`overflow-hidden hover:scale-105 transition-transform duration-200 ${
                index % 2 === 0
                  ? "bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-green-500"
                  : "bg-gradient-to-br from-green-900 to-teal-900 border-2 border-yellow-500"
              }`}
            >
              <CardContent className="p-2 relative">
                {coin.isLiveStreaming && (
                  <Badge className="absolute top-1 right-1 text-black text-[8px] px-1 py-0.5 animate-[pulse_1s_ease-in-out_infinite,rainbow_5s_linear_infinite]">
                    🔴 LIVE
                  </Badge>
                )}
                <div className="flex items-start space-x-2">
                  <Avatar className="w-16 h-16 rounded-md border-2 border-yellow-500">
                    <AvatarImage
                      src={coin.image}
                      alt={coin.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-800 text-yellow-500">
                      {coin.ticker}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 flex items-center">
                      <Cpu className="w-3 h-3 mr-1 text-green-400" />
                      Created by{" "}
                      <span className="text-green-400 ml-1">
                        {coin.creator}
                      </span>{" "}
                      {coin.createdAgo}
                    </p>
                    <p className="text-[10px] flex items-center">
                      <Bitcoin className="w-3 h-3 mr-1 text-yellow-500" />
                      <span className="text-green-400 mr-1">
                        market cap:
                      </span>{" "}
                      {coin.marketCap}{" "}
                      <Badge
                        variant="outline"
                        className="ml-1 bg-yellow-500 text-black text-[8px] animate-pulse"
                      >
                        <Crown className="w-3 h-3" />
                      </Badge>
                    </p>
                    <p className="text-[10px] flex items-center">
                      <Users className="w-3 h-3 mr-1 text-blue-400" /> replies:{" "}
                      {coin.replies}
                    </p>
                    <p className="font-bold text-yellow-300 text-[11px] mt-1 flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                      {coin.name}{" "}
                      <span className="text-gray-400 ml-1">
                        (ticker: {coin.ticker})
                      </span>
                    </p>
                    <p className="mt-1 text-gray-300 text-[9px] break-words">
                      {coin.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
