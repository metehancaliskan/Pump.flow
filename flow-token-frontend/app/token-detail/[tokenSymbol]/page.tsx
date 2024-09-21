"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { contract_abi } from "@/abi/TokenFactoryAbi";
import { flowTestnet } from "viem/chains";

export default function TokenDetail() {
  const [pageToken, setPageToken] = useState<any>();
  const { data: tokens } = useReadContract<any, any, Array<any>>({
    abi: contract_abi,
    address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
    chainId: flowTestnet.id,
    functionName: "getAllMemeTokens",
  });
  const params = useParams();
  const tokenSymbol = params.tokenSymbol;
  const router = useRouter();

  useEffect(() => {
    console.log(pageToken);
    if (tokens) {
      console.log(tokens);
      console.log(tokenSymbol);
      const token =
        Array.isArray(tokens) &&
        tokens.find((token: any) => token.symbol === tokenSymbol);

      setPageToken(token);
    }
    console.log(pageToken);
  }, [tokenSymbol, tokens, pageToken]);
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
      `}</style>

      <Button
        onClick={() => router.back()}
        variant="outline"
        size="sm"
        className="mb-4 h-6 px-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black flex items-center"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        go back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border border-green-500">
          <CardHeader>
            <CardTitle className="text-lg text-green-400">
              Token Detail for {pageToken?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage
                src={pageToken?.tokenImageUrl}
                alt="Spongebob Token"
              />
              <AvatarFallback>{pageToken?.symbol}</AvatarFallback>
            </Avatar>
            <div className="text-[11px] space-y-2">
              <p className="flex justify-between">
                <span className="text-green-400 font-bold">
                  Creator Address:
                </span>
                <span className="text-gray-300 break-all">
                  {pageToken?.creatorAddress}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-green-400 font-bold">Token Address:</span>
                <span className="text-gray-300 break-all">
                  {pageToken?.tokenAddress}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-green-400 font-bold">
                  Funding Raised:
                </span>
                <span className="text-gray-300">
                  {Number(pageToken?.fundingRaised)}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-green-400 font-bold">Token Symbol:</span>
                <span className="text-gray-300">SPONGE</span>
              </p>
              <p className="flex flex-col">
                <span className="text-green-400 font-bold">Description:</span>
                <span className="text-gray-300 mt-1">
                  This is a spongebob token
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg text-blue-400">
              Bonding Curve Progress: 0 / 24 FLOW
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={0} max={24} className="h-2 bg-blue-900" />
            <p className="text-[10px] text-blue-300">
              When the market cap reaches 24 FLOW, all the liquidity from the
              bonding curve will be deposited into Uniswap, and the LP tokens
              will be burned. Progression increases as the price goes up.
            </p>
            <div className="mt-4">
              <p className="text-blue-400 mb-1">
                Remaining Tokens Available for Sale: 800000 / 800,000
              </p>
              <Progress
                value={800000}
                max={800000}
                className="h-2 bg-blue-500"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-blue-400 mb-2">Buy Tokens</h3>
              <Input
                placeholder="Enter amount of tokens to buy"
                className="mb-2 h-6 text-[10px] bg-gray-700 border-blue-500 text-blue-300 placeholder-blue-600"
              />
              <Button className="w-full h-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]">
                Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-gray-800 border border-purple-500">
        <CardHeader>
          <CardTitle className="text-lg text-purple-400">Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-purple-300">Owner Address</TableHead>
                <TableHead className="text-purple-300">
                  Percentage of Total Supply
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-[10px]">
                  {pageToken?.creatorAddress}
                </TableCell>
                <TableCell className="text-[10px]">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 overflow-hidden">
        <Badge
          variant="secondary"
          className="bg-yellow-400 text-black px-1 py-0.5 text-[8px] whitespace-nowrap animate-[slide_20s_linear_infinite]"
        >
          SPONGE price: 0.00042 FLOW • 24h volume: 1.5 FLOW • Market cap: 336
          FLOW • Holders: 150 • Transactions: 1,234
        </Badge>
      </div>
    </div>
  );
}
