"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { flowTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { injected } from "@wagmi/connectors";

const config = createConfig(
  getDefaultConfig({
    connectors: [injected()],
    transports: {
      [flowTestnet.id]: http(),
    },
    // Your dApps chains
    chains: [flowTestnet],

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Meme coin gen",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="retro"
          mode="dark"
          customTheme={{
            "--ck-connectbutton-font-size": "8px",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
