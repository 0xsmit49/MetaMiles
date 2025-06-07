import React from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Providers } from '../app/providers'; // Import the providers

// MetaMask Wallet Component
const MetaMaskWallet: React.FC = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainName = (chainId: number): string => {
    const chains: Record<number, string> = {
      1: 'Ethereum Mainnet',
      137: 'Polygon Mainnet',
      42161: 'Arbitrum One',
      10: 'Optimism',
      11155111: 'Sepolia Testnet',
    };
    return chains[chainId] || `Chain ID: ${chainId}`;
  };

  // Handle chain switching
  const handleSwitchChain = (targetChainId: number) => {
    switchChain({ chainId: targetChainId });
  };

  // Handle connection
  const handleConnect = () => {
    const metamaskConnector = connectors.find(connector => connector.name === 'MetaMask');
    if (metamaskConnector) {
      connect({ connector: metamaskConnector });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleConnect}
          disabled={isConnecting || isPending}
          className="w-[16rem] bg-gradient-to-r from-orange-300 to-orange-300 hover:from-orange-100 hover:to-orange-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isConnecting || isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <span>Connect MetaMask</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Connected Account Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Connected Account</div>
        <div className="font-mono text-lg font-bold">
          {address && formatAddress(address)}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {getChainName(chainId)}
        </div>
      </div>

      {/* Chain Switching Options */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleSwitchChain(1)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chainId === 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Ethereum
        </button>
        <button
          onClick={() => handleSwitchChain(137)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chainId === 137
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Polygon
        </button>
        <button
          onClick={() => handleSwitchChain(42161)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chainId === 42161
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Arbitrum
        </button>
        <button
          onClick={() => handleSwitchChain(10)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chainId === 10
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Optimism
        </button>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={() => disconnect()}
        className="w-[10rem] bg-orange-100 hover:bg-orange-200 text-black font-bold py-2 px-4 rounded-lg transition-colors text-lg"
      >
        Disconnect
      </button>
    </div>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            MetaMask SDK Wallet
          </h1>
          <MetaMaskWallet />
        </div>
      </div>
    </Providers>
  );
};

export default App;