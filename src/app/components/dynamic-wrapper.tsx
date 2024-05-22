"use client";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import {
  createConfig,
  WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet } from 'viem/chains';

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useRouter } from "next/navigation"
import { useContext } from "react";
import { ContextValue } from "./../context/context";
import { UserScores, UserSettings } from "@prisma/client";

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function ProviderWrapper({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const { random, changeScore, changeSettings, multiplerUpdater } = useContext(ContextValue);
  return (
    <DynamicContextProvider
      theme='dark'
      settings={{
        environmentId: `${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ? process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID : ""}`,
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onAuthFlowClose: () => {
            console.log('in onAuthFlowClose');
          },
          onAuthFlowOpen: () => {
            console.log('in onAuthFlowOpen');
          },
          onAuthSuccess: () => {
            multiplerUpdater();
            console.log("YYESSS")
            router.push("/");
          },
          onLogout: () => {
            console.log('in onLogout');
            changeScore({} as UserScores);
            changeSettings({} as UserSettings);
            router.push("/login");

          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}