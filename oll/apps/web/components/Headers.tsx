import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface WalletState {
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  addToken: (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => Promise<void>;
}

// Create Context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider Component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const getMetaMaskProvider = () => {
    if (typeof window === 'undefined') return null;
    
    // First, try to find MetaMask in the providers array
    if (window.ethereum?.providers?.length > 0) {
      const metamaskProvider = window.ethereum.providers.find((provider: any) => 
        provider.isMetaMask && !provider.isTrust && !provider.isPhantom
      );
      if (metamaskProvider) return metamaskProvider;
    }
    
    // Check if window.ethereum is specifically MetaMask (and not other wallets)
    if (window.ethereum?.isMetaMask && 
        !window.ethereum.isTrust && 
        !window.ethereum.isPhantom &&
        !window.ethereum.isBraveWallet) {
      return window.ethereum;
    }
    
    // Last resort: check for MetaMask global object
    if ((window as any).ethereum?.isMetaMask) {
      return (window as any).ethereum;
    }
    
    return null;
  };

  const isMetaMaskInstalled = (): boolean => {
    return getMetaMaskProvider() !== null;
  };

  const updateWalletState = (updates: Partial<WalletState>) => {
    setWalletState(prev => ({ ...prev, ...updates }));
  };

  const connect = async (): Promise<void> => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      updateWalletState({ error: 'MetaMask is not installed or not detected. Please disable other wallet extensions or use MetaMask directly.' });
      return;
    }

    updateWalletState({ isConnecting: true, error: null });

    try {
      // Force MetaMask to be the active provider
      if (window.ethereum && window.ethereum.providers) {
        window.ethereum.setSelectedProvider?.(provider);
      }

      // Request account access from MetaMask specifically
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      // Get chain ID from MetaMask specifically
      const chainId = await provider.request({
        method: 'eth_chainId',
      }) as string;

      updateWalletState({
        account: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

    } catch (error: any) {
      let errorMessage = 'Failed to connect to MetaMask';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      updateWalletState({
        isConnecting: false,
        error: errorMessage,
        isConnected: false,
        account: null,
        chainId: null,
      });
    }
  };

  const disconnect = async (): Promise<void> => {
    const provider = getMetaMaskProvider();
    
    // Update local state first
    updateWalletState({
      account: null,
      chainId: null,
      isConnected: false,
      error: null,
    });

    // Actually disconnect from MetaMask provider
    if (provider) {
      try {
        // Some versions of MetaMask support wallet_revokePermissions
        if (provider.request) {
          try {
            await provider.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }]
            });
          } catch (revokeError) {
            // If revokePermissions is not supported, try alternative methods
            console.log('wallet_revokePermissions not supported, trying alternative disconnect methods');
            
            // Try to disconnect using eth_requestAccounts with empty array (some wallets support this)
            try {
              await provider.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
              });
            } catch (permError) {
              // If that fails, just log that we've cleared local state
              console.log('MetaMask disconnected locally. User may need to disconnect manually in MetaMask extension.');
            }
          }
        }
      } catch (error: any) {
        console.error('Error during MetaMask disconnect:', error);
        // Even if provider disconnect fails, we've cleared local state
      }
    }
  };

  const switchChain = async (targetChainId: string): Promise<void> => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      updateWalletState({ error: 'MetaMask is not installed or not detected' });
      return;
    }

    try {
      // Force MetaMask to be active
      if (window.ethereum && window.ethereum.providers) {
        window.ethereum.setSelectedProvider?.(provider);
      }

      console.log('Switching chain using MetaMask provider:', provider);
      
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (error: any) {
      console.error('Chain switch error:', error);
      if (error.code === 4902) {
        // Chain not added to MetaMask
        updateWalletState({ error: 'Chain not added to MetaMask' });
      } else {
        updateWalletState({ error: `Failed to switch chain: ${error.message}` });
      }
    }
  };

  const addToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number): Promise<void> => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      updateWalletState({ error: 'MetaMask is not installed' });
      return;
    }

    try {
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });
    } catch (error: any) {
      updateWalletState({ error: `Failed to add token: ${error.message}` });
    }
  };

  // Initialize and set up event listeners
  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      return;
    }

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await provider.request({
          method: 'eth_accounts',
        }) as string[];

        if (accounts.length > 0) {
          const chainId = await provider.request({
            method: 'eth_chainId',
          }) as string;

          updateWalletState({
            account: accounts[0],
            chainId,
            isConnected: true,
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    // Event listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // This will be called when user disconnects from MetaMask extension
        updateWalletState({
          account: null,
          chainId: null,
          isConnected: false,
          error: null,
        });
      } else {
        updateWalletState({
          account: accounts[0],
          isConnected: true,
          error: null,
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      updateWalletState({ chainId });
    };

    const handleDisconnect = () => {
      updateWalletState({
        account: null,
        chainId: null,
        isConnected: false,
        error: null,
      });
    };

    // Add event listeners to MetaMask provider specifically
    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
        provider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const contextValue: WalletContextType = {
    ...walletState,
    connect,
    disconnect,
    switchChain,
    addToken,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// MetaMask Wallet Component
const MetaMaskWallet: React.FC = () => {
  const { 
    account, 
    chainId, 
    isConnected, 
    isConnecting, 
    error, 
    connect, 
    disconnect, 
    switchChain 
  } = useWallet();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainName = (chainId: string): string => {
    const chains: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0xa4b1': 'Arbitrum One',
      '0xa': 'Optimism',
    };
    return chains[chainId] || `Chain ID: ${chainId}`;
  };

  if (!isConnected) {
    return (
     
          
      <button
      onClick={connect}
      disabled={isConnecting}
      className="w-[16rem] bg-gradient-to-r from-orange-300 to-orange-300 hover:from-orange-100 hover:to-orange-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>Connect MetaMask</span>
        </>
      )}
    </button>
    

    );
  }

  return (

     
    <button
    onClick={disconnect}
    className="w-[10rem] bg-orange-100 hover:bg-orange-200 text-black font-bold py-2 px-4 rounded-lg transition-colors text-lg"
  >
    Disconnect
  </button>
  
 

  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <WalletProvider>
      
        <MetaMaskWallet />
    
    </WalletProvider>
  );
};

export default App;