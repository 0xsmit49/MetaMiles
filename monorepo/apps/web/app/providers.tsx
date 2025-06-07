
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, polygon,linea, lineaSepolia , arbitrum, optimism, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";


// Configure Wagmi with MetaMask SDK
const config = createConfig({
  ssr: true,
  chains: [mainnet, polygon, arbitrum, optimism, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create QueryClient for React Query
const queryClient = new QueryClient();

// Combined Providers Component
interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;