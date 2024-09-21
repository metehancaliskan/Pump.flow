import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuyTabContent from "./buy-tab-content";
import SellTabContent from "./sell-tab-content";

interface Token {
  creatorAddress: string;
  description: string;
  fundingRaised: bigint;
  name: string;
  symbol: string;
  tokenAddress: string;
  tokenImageUrl: string;
}

export default function TokenTrade({
  token,
  totalSupply,
}: {
  token: Token;
  totalSupply: number;
}) {
  const [amount, setAmount] = useState("0.0");
  const [activeTab, setActiveTab] = useState("buy");

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-green-300 dark:border-green-500 w-full max-w-full">
      <CardContent className="p-4">
        <Tabs
          defaultValue="buy"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 h-8 mb-4">
            <TabsTrigger
              value="buy"
              className={`text-xs ${
                activeTab === "buy"
                  ? "bg-green-500 text-black dark:text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-green-500 dark:text-green-400"
              }`}
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className={`text-xs ${
                activeTab === "sell"
                  ? "bg-red-500 text-black dark:text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400"
              }`}
            >
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <BuyTabContent
              totalSupply={totalSupply}
              token={token}
              amount={amount}
              onAmountChange={handleAmountChange}
              onQuickAmount={handleQuickAmount}
            />
          </TabsContent>

          <TabsContent value="sell">
            <SellTabContent
              token={token}
              amount={amount}
              onAmountChange={handleAmountChange}
              onQuickAmount={handleQuickAmount}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
