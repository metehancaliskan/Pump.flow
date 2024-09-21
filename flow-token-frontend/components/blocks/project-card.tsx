import React from "react";
import { Badge } from "../ui/badge";
import { Bitcoin, Cpu, Crown, Users, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  token: {
    creatorAddress: string;
    description: string;
    fundingRaised: string;
    name: string;
    symbol: string;
    tokenAddress: number;
    tokenImageUrl: string;
  };
  key: number;
  index: number;
};

const ProjectCarc = ({ token, index }: Props) => {
  console.log(index);
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        router.push(`/token-detail/${token.symbol}`);
      }}
      key={token.symbol}
      className={`overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer ${
        index % 2 === 0
          ? "bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-green-500"
          : "bg-gradient-to-br from-green-900 to-teal-900 border-2 border-yellow-500"
      }`}
    >
      <CardContent className="p-2 relative">
        {Math.random() < 0.5 && (
          <Badge className="absolute top-1 right-1 text-black text-[8px] px-1 py-0.5 animate-[pulse_1s_ease-in-out_infinite,rainbow_5s_linear_infinite]">
            🔴 LIVE
          </Badge>
        )}
        <div className="flex items-start space-x-2">
          <Avatar className="w-16 h-16 rounded-md border-2 border-yellow-500">
            <AvatarImage
              src={token.tokenImageUrl}
              alt={token.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-800 text-yellow-500">
              {token.symbol}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 flex items-center">
              <Cpu className="w-3 h-3 mr-1 text-green-400" />
              Created by{" "}
              <span className="text-green-400 ml-1">
                {token.creatorAddress}
              </span>
              47m ago
            </p>
            <p className="text-[10px] flex items-center">
              <Bitcoin className="w-3 h-3 mr-1 text-yellow-500" />
              <span className="text-green-400 mr-1">market cap:</span>{" "}
              {Number(token.fundingRaised)}{" "}
              <Badge
                variant="outline"
                className="ml-1 bg-yellow-500 text-black text-[8px] animate-pulse"
              >
                <Crown className="w-3 h-3" />
              </Badge>
            </p>
            <p className="text-[10px] flex items-center">
              <Users className="w-3 h-3 mr-1 text-blue-400" /> replies:{" "}
              <span className="ml-1">{Math.floor(Math.random() * 10) + 3}</span>
            </p>
            <p className="font-bold text-yellow-300 text-[11px] mt-1 flex items-center">
              <Zap className="w-3 h-3 mr-1 text-yellow-500" />
              {token.name}{" "}
              <span className="text-gray-400 ml-1">
                (ticker: {token.symbol})
              </span>
            </p>
            <p className="mt-1 text-gray-300 text-[9px] break-words">
              {token.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCarc;
