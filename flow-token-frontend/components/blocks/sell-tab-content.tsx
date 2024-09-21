import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWriteContract } from "wagmi";
import { contract_abi } from "@/abi/TokenFactoryAbi";
import { flowTestnet } from "viem/chains";
import { useQueryClient } from "@tanstack/react-query";

interface Token {
  creatorAddress: string;
  description: string;
  fundingRaised: bigint;
  name: string;
  symbol: string;
  tokenAddress: string;
  tokenImageUrl: string;
}
interface SellTabContentProps {
  token: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  onQuickAmount: (value: number) => void;
}

export default function SellTabContent({
  token,
  amount,
  onAmountChange,
  onQuickAmount,
}: SellTabContentProps) {
  const {
    writeContractAsync,
    data: hash,
    variables,
    status,
    isPending,
  } = useWriteContract();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      hash &&
      status == "success" &&
      variables.functionName == "sellMemeToken"
    ) {
      alert("Transaction successful");
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 3000);
    }
  }, [hash]);

  const sellToken = () => {
    writeContractAsync({
      abi: contract_abi,
      address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
      chainId: flowTestnet.id,
      functionName: "sellMemeToken",
      args: [token.tokenAddress, amount],
    });
  };
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full h-8 text-sm bg-gray-100 dark:bg-gray-700 border-red-300 dark:border-red-500 text-red-600 dark:text-red-400 pr-16"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-red-600 dark:text-red-400 text-sm">
            {token.symbol}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAmountChange("0")}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500"
        >
          reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(1)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500"
        >
          1 {token.symbol}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(5)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500"
        >
          5 {token.symbol}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(10)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400 border-red-300 dark:border-red-500"
        >
          10 {token.symbol}
        </Button>
      </div>

      <Button
        onClick={() => {
          sellToken();
        }}
        className="w-full h-8 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold text-sm"
        disabled={isPending}
      >
        {isPending ? (
          <svg
            className="animate-spin h-5 w-5 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          `Sell ${token.symbol}`
        )}
      </Button>
    </div>
  );
}
