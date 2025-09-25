import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { TradingInterface } from './TradingInterface';
import { OrderBook } from './OrderBook';
import { ZKProofModal } from './ZKProofModal';
import { Header } from './Header';
import { Stats } from './Stats';

export const DarkPoolApp: React.FC = () => {
  const { isConnected } = useAccount();
  const [showZKModal, setShowZKModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        
        {/* Main content */}
        <div className="container mx-auto px-6 py-8">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                  Dark Pool DEX
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                  Privacy-preserving decentralized trading with zero-knowledge proofs. 
                  Trade without revealing your positions to the world.
                </p>
                
                <div className="flex flex-col items-center space-y-6">
                  <ConnectButton />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-12">
                    <div className="trading-card text-center">
                      <div className="text-accent-500 mb-3">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Zero-Knowledge Privacy</h3>
                      <p className="text-gray-400 text-sm">
                        Trade without revealing order amounts or strategies using SP1 proofs
                      </p>
                    </div>
                    
                    <div className="trading-card text-center">
                      <div className="text-accent-500 mb-3">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">MEV Protection</h3>
                      <p className="text-gray-400 text-sm">
                        Protected from front-running and sandwich attacks through private mempool
                      </p>
                    </div>
                    
                    <div className="trading-card text-center">
                      <div className="text-accent-500 mb-3">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Institutional Grade</h3>
                      <p className="text-gray-400 text-sm">
                        Built on EigenLayer with cryptographic guarantees for large trades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Stats />
              
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
                {/* Trading Interface - Takes 3 columns */}
                <div className="xl:col-span-3">
                  <TradingInterface 
                    onTradeSubmit={(trade) => {
                      setPendingTrade(trade);
                      setShowZKModal(true);
                    }} 
                  />
                </div>
                
                {/* Order Book - Takes 1 column */}
                <div className="xl:col-span-1">
                  <OrderBook />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* ZK Proof Modal */}
      {showZKModal && (
        <ZKProofModal 
          isOpen={showZKModal}
          onClose={() => setShowZKModal(false)}
          tradeData={pendingTrade}
        />
      )}
    </div>
  );
};
