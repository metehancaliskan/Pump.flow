import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Cpu, Crown, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  index: number;
};

const ProjectCard = ({ token, index }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push(`/token-detail/${token.symbol}`);
      }}
      className={`overflow-hidden cursor-pointer transition-colors duration-200
        ${
          index % 2 === 0
            ? "dark:from-purple-900 dark:to-blue-900 dark:border-green-500 from-purple-100 to-blue-100 border-green-300"
            : "dark:from-green-900 dark:to-teal-900 dark:border-yellow-500 from-green-100 to-teal-100 border-yellow-300"
        }
        hover:bg-opacity-80 dark:hover:bg-opacity-80 border-2`}
    >
      <CardContent className="p-2 relative">
        {Math.random() < 0.5 && (
          <Badge className="absolute top-1 right-1 text-black dark:text-white text-[8px] px-1 py-0.5 animate-pulse bg-red-400 dark:bg-red-600">
            🔴 LIVE
          </Badge>
        )}
        <div className="flex items-start space-x-2">
          <Avatar className="w-12 h-12 rounded-md border-2 border-yellow-500 dark:border-yellow-400">
            <AvatarImage
              src={token.tokenImageUrl}
              alt={token.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-yellow-500 dark:text-yellow-400">
              {token.symbol}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-gray-600 dark:text-gray-400 flex items-center">
              <Cpu className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold truncate">
                {token.creatorAddress.slice(0, 6)}...
                {token.creatorAddress.slice(-4)}
              </span>
            </p>
            <p className="text-[9px] flex items-center">
              <Bitcoin className="w-3 h-3 mr-1 text-yellow-600 dark:text-yellow-500" />
              <span className="text-green-600 dark:text-green-400 mr-1">
                cap:
              </span>
              {Number(token.fundingRaised).toFixed(2)}
              <Badge
                variant="outline"
                className="ml-1 bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white text-[7px] animate-pulse"
              >
                <Crown className="w-2 h-2" />
              </Badge>
            </p>
            <p className="text-[10px] flex items-center">
              <Users className="w-3 h-3 mr-1 text-blue-400" /> replies:{" "}
              <span className="ml-1">{Math.floor(Math.random() * 10) + 3}</span>
            </p>
            <p className="font-bold text-purple-700 dark:text-yellow-300 text-[10px] mt-1 flex items-center truncate">
              <Zap className="w-3 h-3 mr-1 text-yellow-600 dark:text-yellow-500" />
              {token.name}
              <span className="text-gray-600 dark:text-gray-400 ml-1 font-normal">
                ({token.symbol})
              </span>
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-300 text-[8px] line-clamp-2">
              {token.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
