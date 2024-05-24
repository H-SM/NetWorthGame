"use client";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import {
  WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { injected } from "@wagmi/connectors"

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ContextValue } from "./../context/context";
import { UserScores, UserSettings } from "@prisma/client";
// import { SepliaSansChromaLogo } from "@dynamic-labs/sdk-react-icons";

const config = createConfig({
  chains: [ mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function ProviderWrapper({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const { multi, toggleMulti, changeScore, changeSettings } = useContext(ContextValue);


  const handleAuthSuccess = () => {
    toggleMulti();
    router.push("/");
  };

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
          onAuthSuccess: handleAuthSuccess,
          onLogout: () => {
            console.log('in onLogout');
            changeScore({} as UserScores);
            changeSettings({} as UserSettings);
            if(multi === true) toggleMulti();
            router.push("/login");
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector suppressChainMismatchError>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
