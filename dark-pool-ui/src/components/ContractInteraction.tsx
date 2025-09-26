import React, { useState, useEffect } from 'react';
import { TransactionInfo, ProofStep, SP1ProofData } from '../config/contracts';
import { web3Service } from '../utils/web3';
import { sp1Backend } from '../services/sp1-backend';
import { BlockchainScanner } from '../services/blockchain-scanner';
import { CopyButton, InlineCopyHash } from './CopyButton';

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
  const [logs, setLogs] = useState<string[]>([]);
  const [zkVerifyStatus, setZkVerifyStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const generateRealProof = async () => {
    setIsGenerating(true);
    setProofSteps([]);
    setFinalProof(null);
    setLogs([]);

    try {
      console.log('🔬 Starting REAL SP1 proof generation...');
      setLogs(['🔬 Connecting to SP1 backend...', '🦀 Checking Rust environment...']);
      
      const result = await sp1Backend.generateRealProof();
      
      // Update UI with real-time steps
      let stepIndex = 0;
      const updateInterval = setInterval(() => {
        if (stepIndex < result.steps.length) {
          setProofSteps([...result.steps.slice(0, stepIndex + 1)]);
          stepIndex++;
        } else {
          clearInterval(updateInterval);
          setFinalProof(result.finalProof);
          setLogs(result.logs);
        }
      }, 1000);

    } catch (error: any) {
      console.error('Real SP1 proof generation failed:', error);
      setLogs(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  const runZkVerifyDemo = async () => {
    setZkVerifyStatus('running');
    setLogs(prev => [...prev, '🌐 Starting zkVerify integration...']);

    try {
      const result = await sp1Backend.runZkVerifyDemo();
      setLogs(prev => [...prev, ...result.logs]);
      setZkVerifyStatus(result.success ? 'success' : 'error');
    } catch (error: any) {
      setLogs(prev => [...prev, `❌ zkVerify error: ${error.message}`]);
      setZkVerifyStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
          🔬 Real SP1 + zkVerify Integration
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={generateRealProof}
            disabled={isGenerating}
            style={{
              backgroundColor: '#059669',
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
            {isGenerating ? '🔄 Generating...' : '🔬 Generate SP1 Proof'}
          </button>
          <button
            onClick={runZkVerifyDemo}
            disabled={zkVerifyStatus === 'running' || !finalProof}
            style={{
              backgroundColor: zkVerifyStatus === 'success' ? '#10b981' : '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: (zkVerifyStatus === 'running' || !finalProof) ? 'not-allowed' : 'pointer',
              opacity: (zkVerifyStatus === 'running' || !finalProof) ? 0.7 : 1,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {zkVerifyStatus === 'running' ? '🌐 Running...' : 
             zkVerifyStatus === 'success' ? '✅ zkVerify OK' : '🌐 Submit to zkVerify'}
          </button>
        </div>
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
            🎉 Real SP1 Proof Generated Successfully!
          </h4>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Image ID: </span>
              <span style={{ color: '#10b981' }}>{finalProof.image_id}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Proof Size: </span>
              <span style={{ color: 'white' }}>{Math.round(finalProof.proof.length / 2)} bytes (SHRINK format)</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>Public Values: </span>
              <span style={{ color: 'white' }}>{finalProof.public_values.slice(0, 20)}...</span>
            </div>
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '600' }}>🌐 zkVerify Compatible</span>
              <br />
              <span style={{ color: '#9ca3af', fontSize: '11px' }}>Ready for testnet verification</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionViewer: React.FC<{ userAddress?: string }> = ({ userAddress }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchHash, setSearchHash] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');

  const searchTransaction = async () => {
    if (!searchHash.trim()) {
      setSearchError('Please enter a transaction hash');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const scanner = new BlockchainScanner(selectedNetwork);
      const txDetails = await scanner.getTransaction(searchHash.trim());
      
      if (txDetails) {
        const formattedTx = {
          hash: txDetails.hash,
          status: txDetails.status === 'success' ? 'confirmed' : 
                  txDetails.status === 'failed' ? 'failed' : 'pending',
          type: scanner.isDarkPoolTransaction(txDetails) ? 'Dark Pool Trade' : 'External Transaction',
          timestamp: txDetails.timestamp,
          blockNumber: txDetails.blockNumber,
          gasUsed: txDetails.gasUsed,
          from: txDetails.from,
          to: txDetails.to,
          value: txDetails.value,
          confirmations: txDetails.confirmations,
          scannerUrl: txDetails.scannerUrl,
          network: txDetails.network,
          isDarkPool: scanner.isDarkPoolTransaction(txDetails)
        };

        setTransactions(prev => [formattedTx, ...prev.filter(tx => tx.hash !== formattedTx.hash)]);
      } else {
        setSearchError('Transaction not found on the blockchain');
      }
    } catch (error: any) {
      setSearchError(error.message || 'Failed to fetch transaction');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
          🔍 Blockchain Transaction Lookup
        </label>
        
        {/* Network Selector */}
        <div style={{ marginBottom: '12px' }}>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            style={{
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '6px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '12px',
              marginRight: '8px'
            }}
          >
            <option value="sepolia">Sepolia Testnet</option>
            <option value="ethereum">Ethereum Mainnet</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="base">Base</option>
            <option value="anvil">Local Anvil</option>
          </select>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            Choose network for verification
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="0x1234567890abcdef... (full transaction hash)"
            style={{
              flex: 1,
              backgroundColor: '#374151',
              border: searchError ? '1px solid #ef4444' : '1px solid #4b5563',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchTransaction()}
          />
          <button
            onClick={searchTransaction}
            disabled={isSearching}
            style={{
              backgroundColor: isSearching ? '#6b7280' : '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isSearching ? '🔄 Searching...' : '🔍 Verify on Chain'}
          </button>
        </div>

        {/* Sample hashes for testing */}
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
          <span>Try sample: </span>
          <button
            onClick={() => setSearchHash('0x742d35Cc6Df35180a24f86230CA25c337c8bb405cf1d269b5836ed7b66af5415')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#60a5fa', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontSize: '11px'
            }}
          >
            Sample Hash
          </button>
        </div>

        {searchError && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            color: '#ef4444',
            fontSize: '12px'
          }}>
            ❌ {searchError}
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div>
          <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            ✅ Verified Blockchain Transactions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                style={{
                  backgroundColor: tx.isDarkPool ? 'rgba(139, 92, 246, 0.1)' : 'rgba(55, 65, 81, 0.5)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: tx.isDarkPool ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(75, 85, 99, 0.5)'
                }}
              >
                {/* Transaction Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#60a5fa', fontWeight: '600' }}>
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </div>
                      {tx.isDarkPool && (
                        <span style={{
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          color: '#a855f7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          🕶️ DARK POOL
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                      <span style={{ marginRight: '12px' }}>
                        Type: <span style={{ color: 'white' }}>{tx.type}</span>
                      </span>
                      <span style={{ marginRight: '12px' }}>
                        Status: <span style={{ 
                          color: tx.status === 'confirmed' ? '#10b981' : 
                                tx.status === 'pending' ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {tx.status.toUpperCase()}
                        </span>
                      </span>
                      <span>
                        Network: <span style={{ color: '#60a5fa' }}>{tx.network}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* External Link */}
                  <a 
                    href={tx.scannerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#374151',
                      color: '#60a5fa',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      textDecoration: 'none',
                      border: '1px solid #4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🔗 View on {tx.network.includes('Sepolia') ? 'Etherscan' : tx.network}
                  </a>
                </div>

                {/* Transaction Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Block Number:</span>
                    <div style={{ color: 'white', fontFamily: 'monospace' }}>{tx.blockNumber}</div>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Confirmations:</span>
                    <div style={{ color: '#10b981', fontWeight: '600' }}>{tx.confirmations}</div>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Gas Used:</span>
                    <div style={{ color: 'white' }}>{parseInt(tx.gasUsed).toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Timestamp:</span>
                    <div style={{ color: 'white' }}>{new Date(tx.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                {/* From/To Addresses */}
                <div style={{ marginTop: '12px', fontSize: '11px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#9ca3af' }}>From: </span>
                    <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>
                      {tx.from.slice(0, 10)}...{tx.from.slice(-8)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>To: </span>
                    <span style={{ color: '#10b981', fontFamily: 'monospace' }}>
                      {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Copy Actions */}
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <CopyButton 
                    text={tx.hash}
                    label="Transaction Hash"
                    type="transaction"
                    network={tx.network}
                    size="small"
                  />
                </div>

                {/* Double Verification Badge */}
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '11px',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ✅ <strong>Double Verified:</strong> Transaction confirmed on blockchain and verified via {tx.network}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
