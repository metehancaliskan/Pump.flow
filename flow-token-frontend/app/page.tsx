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
import { MessageCircle, Wallet } from "lucide-react";
import CreateTokenDialog from "@/components/blocks/create-token-dialog";

export default function Component() {
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            {
              name: "Notepad",
              ticker: "PAD",
              description: "It's literally just a notepad.",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Moonshine",
              ticker: "MOON",
              description: "The famous rarest albino alligator",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Meow Ming",
              ticker: "Ming",
              description: "The Tallest Cat on Solana",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Pixel Pals",
              ticker: "PIX",
              description: "Retro-style digital pets",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "CryptoQuest",
              ticker: "QUEST",
              description: "Blockchain-based RPG adventure",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "BitBrew",
              ticker: "BREW",
              description: "Decentralized coffee marketplace",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "NanoNFT",
              ticker: "NNFT",
              description: "Microscopic digital collectibles",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "VoxelVerse",
              ticker: "VOX",
              description: "3D voxel metaverse platform",
              image: "/placeholder.svg?height=100&width=100",
            },
          ].map((coin) => (
            <Card
              key={coin.ticker}
              className="bg-gray-800 border border-purple-500 overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <CardHeader className="p-2">
                <CardTitle className="text-purple-300 text-xs">
                  {coin.name} ({coin.ticker})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <Avatar className="w-full h-20 rounded-md">
                  <AvatarImage
                    src={coin.image}
                    alt={coin.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-purple-900 text-purple-300">
                    {coin.ticker}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-1 text-purple-200 text-[10px]">
                  {coin.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
