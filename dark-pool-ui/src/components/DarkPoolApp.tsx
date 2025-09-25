import React, { useState } from 'react';

export const DarkPoolApp: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showZKModal, setShowZKModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  const handleTradeSubmit = (trade: any) => {
    setPendingTrade(trade);
    setShowZKModal(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      position: 'relative'
    }}>
      {/* Background effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
        pointerEvents: 'none'
      }} />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <header style={{
          background: 'rgba(31, 41, 55, 0.5)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  🌊
                </div>
                
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Dark Pool DEX</h1>
                  <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Privacy-First Trading</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#9ca3af' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  <span>Anvil Testnet</span>
                </div>
                
                {!isConnected ? (
                  <button
                    onClick={handleConnectWallet}
                    style={{
                      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8, #6d28d9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb, #7c3aed)';
                    }}
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '14px' }}>0xf39F...2266</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          {!isConnected ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '60vh',
              gap: '32px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Dark Pool DEX
                </h1>
                <p style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  marginBottom: '32px',
                  maxWidth: '600px'
                }}>
                  Privacy-preserving decentralized trading with zero-knowledge proofs. 
                  Trade without revealing your positions to the world.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                  <button
                    onClick={handleConnectWallet}
                    style={{
                      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8, #6d28d9)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb, #7c3aed)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Connect Wallet to Start Trading
                  </button>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    maxWidth: '1000px',
                    marginTop: '48px'
                  }}>
                    <FeatureCard
                      icon="🔐"
                      title="Zero-Knowledge Privacy"
                      description="Trade without revealing order amounts or strategies using SP1 proofs"
                    />
                    <FeatureCard
                      icon="🛡️"
                      title="MEV Protection"
                      description="Protected from front-running and sandwich attacks through private mempool"
                    />
                    <FeatureCard
                      icon="⚙️"
                      title="Institutional Grade"
                      description="Built on EigenLayer with cryptographic guarantees for large trades"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <StatsSection />
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '3fr 1fr',
                gap: '32px',
                marginTop: '32px'
              }}>
                <TradingInterface onTradeSubmit={handleTradeSubmit} />
                <OrderBook />
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

const FeatureCard: React.FC<{icon: string, title: string, description: string}> = ({icon, title, description}) => (
  <div style={{
    background: 'rgba(31, 41, 55, 0.5)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(55, 65, 81, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)';
  }}
  >
    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>{title}</h3>
    <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>{description}</p>
  </div>
);

const StatsSection: React.FC = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  }}>
    {[
      {label: "Total Volume (24h)", value: "$2.4M", change: "+12.5%", icon: "📈"},
      {label: "Hidden Orders", value: "847", change: "Active", icon: "👁️‍🗨️"},
      {label: "ZK Proofs Generated", value: "1,234", change: "+5.2%", icon: "🔐"},
      {label: "Gas Saved", value: "89%", change: "vs Public DEX", icon: "💰"}
    ].map((stat, i) => (
      <div key={i} style={{
        background: 'rgba(31, 41, 55, 0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(55, 65, 81, 0.3)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 4px 0' }}>{stat.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>{stat.value}</p>
            <p style={{ color: '#10b981', fontSize: '14px', margin: 0 }}>{stat.change}</p>
          </div>
          <div style={{ fontSize: '24px' }}>{stat.icon}</div>
        </div>
      </div>
    ))}
  </div>
);

const TradingInterface: React.FC<{onTradeSubmit: (trade: any) => void}> = ({onTradeSubmit}) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [minReceive, setMinReceive] = useState('');
  const [isPrivateOrder, setIsPrivateOrder] = useState(true);

  const handleSubmit = () => {
    if (!amount || !minReceive) return;
    
    onTradeSubmit({
      type: tradeType,
      fromToken,
      toToken,
      amount,
      minReceive,
      isPrivate: isPrivateOrder
    });
  };

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Private Trading</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>Private Order</span>
          <button
            onClick={() => setIsPrivateOrder(!isPrivateOrder)}
            style={{
              position: 'relative',
              display: 'inline-flex',
              height: '24px',
              width: '44px',
              alignItems: 'center',
              borderRadius: '12px',
              transition: 'colors 0.2s',
              backgroundColor: isPrivateOrder ? '#3b82f6' : '#6b7280',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                height: '16px',
                width: '16px',
                transform: isPrivateOrder ? 'translateX(24px)' : 'translateX(4px)',
                borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'transform 0.2s'
              }}
            />
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        padding: '4px',
        backgroundColor: '#374151',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setTradeType('buy')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'colors 0.2s',
            backgroundColor: tradeType === 'buy' ? '#059669' : 'transparent',
            color: tradeType === 'buy' ? 'white' : '#9ca3af',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (tradeType !== 'buy') e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            if (tradeType !== 'buy') e.currentTarget.style.color = '#9ca3af';
          }}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType('sell')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'colors 0.2s',
            backgroundColor: tradeType === 'sell' ? '#dc2626' : 'transparent',
            color: tradeType === 'sell' ? 'white' : '#9ca3af',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (tradeType !== 'sell') e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            if (tradeType !== 'sell') e.currentTarget.style.color = '#9ca3af';
          }}
        >
          Sell
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>From</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                minWidth: '120px'
              }}
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              style={{
                flex: 1,
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
          }}
          >
            ↕️
          </button>
        </div>

        <div>
          <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>To</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                minWidth: '120px'
              }}
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
            <input
              type="number"
              value={minReceive}
              onChange={(e) => setMinReceive(e.target.value)}
              placeholder="0.0"
              style={{
                flex: 1,
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {isPrivateOrder && (
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#60a5fa' }}>🔒</span>
              <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: '500' }}>Zero-Knowledge Privacy Enabled</span>
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: 0 }}>
              Your order amount and balance will be hidden using SP1 proofs. Only execution is visible on-chain.
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!amount || !minReceive}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '18px',
            transition: 'all 0.2s',
            backgroundColor: tradeType === 'buy' ? '#059669' : '#dc2626',
            color: 'white',
            border: 'none',
            cursor: !amount || !minReceive ? 'not-allowed' : 'pointer',
            opacity: !amount || !minReceive ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (amount && minReceive) {
              e.currentTarget.style.backgroundColor = tradeType === 'buy' ? '#047857' : '#b91c1c';
            }
          }}
          onMouseLeave={(e) => {
            if (amount && minReceive) {
              e.currentTarget.style.backgroundColor = tradeType === 'buy' ? '#059669' : '#dc2626';
            }
          }}
        >
          {isPrivateOrder ? '🔒 ' : ''}
          Submit {tradeType === 'buy' ? 'Buy' : 'Sell'} Order
        </button>
      </div>
    </div>
  );
};

const OrderBook: React.FC = () => {
  const orders = [
    {id: '1', address: '0xf39F...2266', side: 'buy' as const, token: 'ETH/USDC', price: 2045.50, status: 'filled', isPrivate: true},
    {id: '2', address: '0x8ba1...4dE2', side: 'sell' as const, token: 'ETH/USDC', price: 2048.20, status: 'pending', isPrivate: true},
    {id: '3', address: '0x742d...5180', side: 'buy' as const, token: 'DAI/USDC', price: 1.001, status: 'filled', isPrivate: false},
    {id: '4', address: '0x1234...abcd', side: 'sell' as const, token: 'ETH/DAI', price: 2046.80, status: 'pending', isPrivate: true},
    {id: '5', address: '0x5678...ef90', side: 'buy' as const, token: 'ETH/USDC', price: 2044.10, status: 'filled', isPrivate: true},
  ];

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      height: 'fit-content'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Dark Pool Orders</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Live</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.map((order) => (
          <div key={order.id} style={{
            backgroundColor: 'rgba(55, 65, 81, 0.5)',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ fontFamily: 'monospace', color: '#d1d5db' }}>{order.address}</span>
              <span style={{ 
                color: order.side === 'buy' ? '#10b981' : '#ef4444',
                fontWeight: '500'
              }}>
                {order.side.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginTop: '4px' }}>
              <span style={{ color: '#9ca3af' }}>{order.token}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'white' }}>
                  {order.isPrivate ? '••••' : `$${order.price}`}
                </span>
                {order.isPrivate && <span style={{ color: '#60a5fa' }}>🔒</span>}
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              marginTop: '4px',
              color: order.status === 'filled' ? '#10b981' : 
                    order.status === 'pending' ? '#f59e0b' : '#ef4444'
            }}>
              {order.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#60a5fa' }}>ℹ️</span>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#60a5fa' }}>Privacy Protected</span>
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
          Order amounts are hidden using zero-knowledge proofs. Only trader addresses and execution status are visible.
        </p>
      </div>

      <div style={{ 
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
            {orders.filter(o => o.isPrivate).length}
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Private Orders</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
            {orders.filter(o => o.status === 'filled').length}
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Executed</p>
        </div>
      </div>
    </div>
  );
};

const ZKProofModal: React.FC<{isOpen: boolean, onClose: () => void, tradeData: any}> = ({isOpen, onClose, tradeData}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Creating Order Commitment',
    'Computing Nullifier Hash', 
    'Building Merkle Proof',
    'Generating SP1 ZK Proof',
    'Submitting to zkVerify',
    'Executing Trade'
  ];

  React.useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        margin: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Zero-Knowledge Proof Generation</h2>
          <button
            onClick={onClose}
            disabled={currentStep < steps.length - 1}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#374151',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentStep < steps.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep < steps.length - 1 ? 0.5 : 1,
              color: 'white'
            }}
            onMouseEnter={(e) => {
              if (currentStep >= steps.length - 1) {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: index < currentStep ? 'rgba(16, 185, 129, 0.2)' :
                             index === currentStep ? 'rgba(59, 130, 246, 0.2)' :
                             'rgba(55, 65, 81, 0.2)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: index < currentStep ? '#10b981' :
                               index === currentStep ? '#3b82f6' :
                               '#6b7280',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {index < currentStep ? '✓' : index === currentStep ? '⏳' : index + 1}
              </div>
              <span style={{ color: 'white', fontWeight: '500' }}>{step}</span>
              {index === currentStep && (
                <div style={{ marginLeft: 'auto', color: '#60a5fa', fontSize: '14px' }}>
                  Processing...
                </div>
              )}
            </div>
          ))}
        </div>

        {currentStep === steps.length - 1 && (
          <div style={{
            marginTop: '24px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#10b981', fontSize: '20px' }}>✅</span>
              <div>
                <h3 style={{ fontWeight: '600', color: '#10b981', margin: '0 0 4px 0' }}>Trade Executed Successfully!</h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Your private trade has been completed with full privacy guarantees.</p>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button 
                onClick={onClose} 
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div style={{
          marginTop: '24px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ color: '#60a5fa', fontSize: '16px' }}>🔒</span>
            <div>
              <h4 style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '8px', fontSize: '14px' }}>Privacy Guarantees</h4>
              <ul style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.5', margin: 0, paddingLeft: '16px' }}>
                <li>Order amounts are cryptographically hidden</li>
                <li>Balance information never revealed on-chain</li>
                <li>SP1 proofs ensure mathematical validity</li>
                <li>Only execution result is publicly visible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};