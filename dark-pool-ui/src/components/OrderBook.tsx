import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  address: string;
  side: 'buy' | 'sell';
  token: string;
  price: number;
  timestamp: number;
  status: 'pending' | 'filled' | 'cancelled';
  isPrivate: boolean;
}

export const OrderBook: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell'>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        address: '0xf39F...2266',
        side: 'buy',
        token: 'ETH/USDC',
        price: 2045.50,
        timestamp: Date.now() - 300000,
        status: 'filled',
        isPrivate: true,
      },
      {
        id: '2',
        address: '0x8ba1...4dE2',
        side: 'sell',
        token: 'ETH/USDC',
        price: 2048.20,
        timestamp: Date.now() - 180000,
        status: 'pending',
        isPrivate: true,
      },
      {
        id: '3',
        address: '0x742d...5180',
        side: 'buy',
        token: 'DAI/USDC',
        price: 1.001,
        timestamp: Date.now() - 120000,
        status: 'filled',
        isPrivate: false,
      },
      {
        id: '4',
        address: '0x1234...abcd',
        side: 'sell',
        token: 'ETH/DAI',
        price: 2046.80,
        timestamp: Date.now() - 60000,
        status: 'pending',
        isPrivate: true,
      },
      {
        id: '5',
        address: '0x5678...ef90',
        side: 'buy',
        token: 'ETH/USDC',
        price: 2044.10,
        timestamp: Date.now() - 30000,
        status: 'filled',
        isPrivate: true,
      },
    ];

    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.side === activeTab;
  });

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-danger';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="trading-card h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Dark Pool Orders</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex p-1 bg-dark-700 rounded-lg mb-4">
        {(['all', 'buy', 'sell'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-accent-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-2 pb-2 mb-3 text-xs text-gray-400 border-b border-dark-600">
        <span>Trader</span>
        <span>Pair/Price</span>
        <span>Status</span>
      </div>

      {/* Orders List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-3 gap-2 py-2 text-sm hover:bg-dark-700/50 rounded-lg px-2 transition-colors"
          >
            {/* Trader Address */}
            <div className="flex flex-col">
              <span className="font-mono text-xs">{order.address}</span>
              <div className="flex items-center space-x-1">
                {order.isPrivate && (
                  <svg className="w-3 h-3 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                  </svg>
                )}
                <span className="text-xs text-gray-500">{formatTime(order.timestamp)}</span>
              </div>
            </div>

            {/* Pair and Price */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">{order.token}</span>
              <div className="flex items-center space-x-1">
                <span className={order.side === 'buy' ? 'text-success' : 'text-danger'}>
                  {order.isPrivate ? '••••' : `$${order.price.toFixed(2)}`}
                </span>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  order.side === 'buy' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                }`}>
                  {order.side.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              {order.isPrivate && (
                <span className="text-xs text-accent-500">ZK Hidden</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
          </svg>
          <span className="text-xs font-medium text-accent-400">Privacy Protected</span>
        </div>
        <p className="text-xs text-gray-400">
          Order amounts are hidden using zero-knowledge proofs. Only trader addresses and execution status are visible.
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm font-semibold">{orders.filter(o => o.isPrivate).length}</p>
          <p className="text-xs text-gray-400">Private Orders</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">{orders.filter(o => o.status === 'filled').length}</p>
          <p className="text-xs text-gray-400">Executed</p>
        </div>
      </div>
    </div>
  );
};
