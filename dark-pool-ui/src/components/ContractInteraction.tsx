import React, { useState, useEffect } from 'react';
import { TransactionInfo, ProofStep, SP1ProofData } from '../config/contracts';
import { web3Service } from '../utils/web3';

interface ContractInteractionProps {
  userAddress?: string;
  onTransactionUpdate?: (tx: TransactionInfo) => void;
}

export const ContractInteraction: React.FC<ContractInteractionProps> = ({ 
  userAddress, 
  onTransactionUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'swap' | 'proof' | 'pool'>('swap');
  const [poolId, setPoolId] = useState('');
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPoolInfo = async () => {
    if (!poolId) {
      setError('Please enter a pool ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const info = await web3Service.getPoolInfo(poolId);
      setPoolInfo(info);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
        Contract Interactions
      </h2>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        padding: '4px',
        backgroundColor: '#374151',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        {[
          { key: 'swap' as const, label: 'Swap Execution', icon: '🔄' },
          { key: 'proof' as const, label: 'ZK Proofs', icon: '🔐' },
          { key: 'pool' as const, label: 'Pool Data', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#9ca3af',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pool Data Tab */}
      {activeTab === 'pool' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
              Pool ID (bytes32)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                placeholder="0x..."
                style={{
                  flex: 1,
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleGetPoolInfo}
                disabled={loading}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Loading...' : 'Get Pool Info'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#ef4444'
            }}>
              {error}
            </div>
          )}

          {poolInfo && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                Pool Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#9ca3af' }}>Price (√P × 2⁹⁶):</span>
                  <br />
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>
                    {formatHash(poolInfo.sqrtPriceX96)}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Tick:</span>
                  <br />
                  <span style={{ color: 'white' }}>{poolInfo.tick}</span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Protocol Fee:</span>
                  <br />
                  <span style={{ color: 'white' }}>{poolInfo.protocolFee}</span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>LP Fee:</span>
                  <br />
                  <span style={{ color: 'white' }}>{poolInfo.lpFee}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ZK Proof Tab */}
      {activeTab === 'proof' && (
        <SP1ProofViewer />
      )}

      {/* Swap Tab */}
      {activeTab === 'swap' && (
        <TransactionViewer userAddress={userAddress} />
      )}
    </div>
  );
};

const SP1ProofViewer: React.FC = () => {
  const [proofSteps, setProofSteps] = useState<ProofStep[]>([]);
  const [finalProof, setFinalProof] = useState<SP1ProofData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = async () => {
    setIsGenerating(true);
    setProofSteps([]);
    setFinalProof(null);

    try {
      const mockOrderData = {
        walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: '1.0',
        minAmountOut: '2000',
        isPrivate: true
      };

      const result = await web3Service.generateZKProof(mockOrderData);
      setProofSteps(result.steps);
      setFinalProof(result.finalProof);
    } catch (error) {
      console.error('Proof generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
          SP1 Proof Generation
        </h3>
        <button
          onClick={generateProof}
          disabled={isGenerating}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.7 : 1,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Proof'}
        </button>
      </div>

      {proofSteps.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {proofSteps.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 
                  step.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
                  step.status === 'processing' ? 'rgba(59, 130, 246, 0.1)' :
                  'rgba(55, 65, 81, 0.3)',
                border: 
                  step.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' :
                  step.status === 'processing' ? '1px solid rgba(59, 130, 246, 0.3)' :
                  '1px solid rgba(55, 65, 81, 0.3)'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  step.status === 'completed' ? '#10b981' :
                  step.status === 'processing' ? '#3b82f6' :
                  '#6b7280',
                color: 'white',
                fontSize: '12px'
              }}>
                {step.status === 'completed' ? '✓' : 
                 step.status === 'processing' ? '⏳' : index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                  {step.name}
                </div>
                {step.hash && (
                  <div style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace' }}>
                    Hash: {step.hash.slice(0, 20)}...
                  </div>
                )}
                {step.commitment && (
                  <div style={{ color: '#60a5fa', fontSize: '12px', fontFamily: 'monospace' }}>
                    Commitment: {step.commitment.slice(0, 20)}...
                  </div>
                )}
              </div>

              {step.status === 'processing' && (
                <div style={{ color: '#60a5fa', fontSize: '12px' }}>
                  Processing...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {finalProof && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            🎉 SP1 Proof Generated Successfully!
          </h4>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Image ID: </span>
              <span style={{ color: '#10b981' }}>{finalProof.image_id}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Proof: </span>
              <span style={{ color: 'white' }}>{finalProof.proof.slice(0, 30)}...</span>
            </div>
            <div>
              <span style={{ color: '#9ca3af' }}>Public Values: </span>
              <span style={{ color: 'white' }}>{finalProof.public_values}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionViewer: React.FC<{ userAddress?: string }> = ({ userAddress }) => {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [searchHash, setSearchHash] = useState('');

  const searchTransaction = async () => {
    if (!searchHash) return;

    try {
      const txInfo = await web3Service.getTransaction(searchHash);
      if (txInfo) {
        setTransactions(prev => [txInfo, ...prev.filter(tx => tx.hash !== txInfo.hash)]);
      }
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
          Transaction Hash Lookup
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="0x..."
            style={{
              flex: 1,
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
          <button
            onClick={searchTransaction}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {transactions.length > 0 && (
        <div>
          <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Transaction History
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                style={{
                  backgroundColor: 'rgba(55, 65, 81, 0.5)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(75, 85, 99, 0.5)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#60a5fa' }}>
                      {tx.hash.slice(0, 20)}...
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Type: {tx.type} • Status: <span style={{ 
                        color: tx.status === 'confirmed' ? '#10b981' : 
                              tx.status === 'pending' ? '#f59e0b' : '#ef4444' 
                      }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(tx.timestamp).toLocaleTimeString()}
                    {tx.blockNumber && <div>Block: {tx.blockNumber}</div>}
                    {tx.gasUsed && <div>Gas: {parseInt(tx.gasUsed).toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
