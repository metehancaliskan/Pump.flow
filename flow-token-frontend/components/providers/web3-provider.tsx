"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { flowTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { injected, walletConnect } from "@wagmi/connectors";

export const config = createConfig(
  getDefaultConfig({
    connectors: [
      injected(),
      walletConnect({
        showQrModal: false,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      }),
    ],
    transports: {
      [flowTestnet.id]: http("https://flow-testnet.g.alchemy.com/v2/JzDENQ87lCifK907U4Fnf0g9jXp3OeUf"),
    },
    // Your dApps chains
    chains: [flowTestnet],

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "Pump Flow",

    // Optional App Info
    appDescription: "Pump Flow meme coin gen",
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
