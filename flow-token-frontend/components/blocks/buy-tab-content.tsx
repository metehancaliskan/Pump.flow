import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReadContract, useWriteContract } from "wagmi";
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
interface BuyTabContentProps {
  token: Token;
  amount: string;
  totalSupply: number;
  onAmountChange: (value: string) => void;
  onQuickAmount: (value: number) => void;
}

export default function BuyTabContent({
  token,
  amount,
  totalSupply,
  onAmountChange,
  onQuickAmount,
}: BuyTabContentProps) {
  const {
    data: calculateCost,
    isFetching,
    isLoading,
  } = useReadContract<any, any, Array<any>>({
    abi: contract_abi,
    address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
    chainId: flowTestnet.id,
    functionName: "calculateCost",
    args: [(totalSupply / 10 ** 18).toFixed(0), amount],
  });
  const {
    writeContractAsync,
    data: hash,
    variables,
    status,
    isPending,
  } = useWriteContract();

  useEffect(() => {
    console.log(totalSupply / 10 ** 18, amount);
    Number(calculateCost);
  }, [amount]);

  const buyToken = async () => {
    const tx = await writeContractAsync({
      abi: contract_abi,
      address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
      chainId: flowTestnet.id,
      functionName: "buyMemeToken",
      args: [token.tokenAddress, amount],
      value: BigInt(calculateCost as number),
    });
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      hash &&
      status == "success" &&
      variables.functionName == "buyMemeToken"
    ) {
      alert("Transaction successful");
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 3000);
    }
  }, [hash]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full h-8 text-sm bg-gray-100 dark:bg-gray-700 border-green-300 dark:border-green-500 text-green-600 dark:text-green-400 pr-16"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-green-600 dark:text-green-400 text-sm">
            {token?.symbol}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAmountChange("0")}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-green-500 dark:text-green-400 border-green-300 dark:border-green-500"
        >
          reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(1)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-green-500 dark:text-green-400 border-green-300 dark:border-green-500"
        >
          1 {token?.symbol}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(5)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-green-500 dark:text-green-400 border-green-300 dark:border-green-500"
        >
          5 {token?.symbol}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAmount(10)}
          className="text-[10px] h-6 bg-gray-200 dark:bg-gray-700 text-green-500 dark:text-green-400 border-green-300 dark:border-green-500"
        >
          10 {token?.symbol}
        </Button>
      </div>

      <Button
        className="w-full h-8 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-black dark:text-white font-bold text-sm flex items-center justify-center"
        onClick={() => {
          buyToken();
        }}
        disabled={isPending || isFetching || isLoading}
      >
        {isFetching || isLoading || isPending ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
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
          `Buy ${token?.symbol}`
        )}
      </Button>
    </div>
  );
}
