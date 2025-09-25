import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header: React.FC = () => {
  return (
    <header className="glass border-b border-dark-600/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-xl font-bold">Dark Pool DEX</h1>
              <p className="text-sm text-gray-400">Privacy-First Trading</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Anvil Testnet</span>
            </div>
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
