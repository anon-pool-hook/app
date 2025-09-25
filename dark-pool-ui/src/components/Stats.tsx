import React from 'react';

export const Stats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="trading-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Volume (24h)</p>
            <p className="text-2xl font-bold">$2.4M</p>
            <p className="text-success text-sm">+12.5%</p>
          </div>
          <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="trading-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Hidden Orders</p>
            <p className="text-2xl font-bold">847</p>
            <p className="text-accent-500 text-sm">Active</p>
          </div>
          <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="trading-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">ZK Proofs Generated</p>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-success text-sm">+5.2%</p>
          </div>
          <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="trading-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Gas Saved</p>
            <p className="text-2xl font-bold">89%</p>
            <p className="text-success text-sm">vs Public DEX</p>
          </div>
          <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
