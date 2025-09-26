import React, { useState, useEffect } from 'react';

interface OrderData {
  id: string;
  user: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  status: 'pending' | 'matched' | 'processing' | 'completed';
  matchGroup?: number;
  cowMatch?: string;
}

interface BatchMetrics {
  totalOrders: number;
  cowMatches: number;
  ammRoutes: number;
  gasSavings: number;
  timeSaved: number;
  proofSizeReduction: number;
}

export const BatchAggregationDemo: React.FC = () => {
  const [currentBatch, setCurrentBatch] = useState<OrderData[]>([]);
  const [batchMetrics, setBatchMetrics] = useState<BatchMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    '📦 Collecting orders in batch',
    '🔍 Analyzing CoW opportunities', 
    '🤝 Matching complementary orders',
    '⚡ Generating aggregated SP1 proof',
    '🌐 Single zkVerify submission'
  ];

  useEffect(() => {
    // Initialize with sample orders
    const sampleOrders: OrderData[] = [
      {
        id: '1',
        user: '0xf39F...2266',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: '2.5',
        minAmountOut: '5,000',
        status: 'pending'
      },
      {
        id: '2', 
        user: '0x70997...70d6',
        tokenIn: 'USDC',
        tokenOut: 'ETH',
        amountIn: '5,100',
        minAmountOut: '2.4',
        status: 'pending'
      },
      {
        id: '3',
        user: '0x3C44...B07b',
        tokenIn: 'ETH',
        tokenOut: 'DAI',
        amountIn: '1.0',
        minAmountOut: '2,000',
        status: 'pending'
      },
      {
        id: '4',
        user: '0x90F7...92C8',
        tokenIn: 'DAI', 
        tokenOut: 'USDC',
        amountIn: '2,050',
        minAmountOut: '2,045',
        status: 'pending'
      },
      {
        id: '5',
        user: '0x1584...E7ab',
        tokenIn: 'USDC',
        tokenOut: 'ETH', 
        amountIn: '3,000',
        minAmountOut: '1.4',
        status: 'pending'
      }
    ];
    
    setCurrentBatch(sampleOrders);
  }, []);

  const startBatchProcessing = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    // Step 1: Collecting orders
    setProcessingStep(1);

    // Step 2: Analyzing CoW opportunities
    setProcessingStep(2);

    // Step 3: Find matches (execute matching logic)
    const updatedOrders = [...currentBatch];
    updatedOrders[0] = { ...updatedOrders[0], status: 'matched', matchGroup: 1, cowMatch: 'Order #2' };
    updatedOrders[1] = { ...updatedOrders[1], status: 'matched', matchGroup: 1, cowMatch: 'Order #1' };
    updatedOrders[4] = { ...updatedOrders[4], status: 'matched', matchGroup: 1, cowMatch: 'Partial fill' };
    setCurrentBatch(updatedOrders);
    
    setProcessingStep(3);

    // Step 4: Generate aggregated proof
    setProcessingStep(4);

    // Step 5: zkVerify submission
    setProcessingStep(5);
    
    // Complete with metrics
    setBatchMetrics({
      totalOrders: 5,
      cowMatches: 2,
      ammRoutes: 1,
      gasSavings: 87,
      timeSaved: 75,
      proofSizeReduction: 94
    });

    // Mark orders as completed
    const completedOrders = updatedOrders.map(order => ({
      ...order,
      status: 'completed' as const
    }));
    setCurrentBatch(completedOrders);
    setIsProcessing(false);
  };

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
          📦 Batch Aggregation & CoW Matching
        </h2>
        <button
          onClick={startBatchProcessing}
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? '#6b7280' : '#8b5cf6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {isProcessing ? '🔄 Processing Batch...' : '🚀 Start Batch Processing'}
        </button>
      </div>

      {/* Current Batch Orders */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Current Batch Orders ({currentBatch.length}/10)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {currentBatch.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
                               order.status === 'matched' ? 'rgba(139, 92, 246, 0.1)' :
                               'rgba(55, 65, 81, 0.3)',
                border: order.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' :
                        order.status === 'matched' ? '1px solid rgba(139, 92, 246, 0.3)' :
                        '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>Order #{order.id}</span>
                <span style={{ 
                  color: order.status === 'completed' ? '#10b981' :
                         order.status === 'matched' ? '#8b5cf6' : '#9ca3af',
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: order.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                                  order.status === 'matched' ? 'rgba(139, 92, 246, 0.2)' :
                                  'rgba(75, 85, 99, 0.2)'
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{ color: '#9ca3af', marginBottom: '4px' }}>
                User: {order.user}
              </div>
              <div style={{ color: 'white', fontWeight: '500' }}>
                {order.amountIn} {order.tokenIn} → {order.minAmountOut} {order.tokenOut}
              </div>
              {order.cowMatch && (
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '4px',
                  color: '#a855f7',
                  fontSize: '11px'
                }}>
                  🤝 CoW Match: {order.cowMatch}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Processing Steps */}
      {isProcessing && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Batch Processing Pipeline
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {processingSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: index < processingStep ? 'rgba(16, 185, 129, 0.1)' :
                                  index === processingStep ? 'rgba(59, 130, 246, 0.1)' :
                                  'rgba(55, 65, 81, 0.3)',
                  border: index < processingStep ? '1px solid rgba(16, 185, 129, 0.3)' :
                          index === processingStep ? '1px solid rgba(59, 130, 246, 0.3)' :
                          '1px solid rgba(75, 85, 99, 0.3)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: index < processingStep ? '#10b981' :
                                  index === processingStep ? '#3b82f6' :
                                  '#6b7280',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {index < processingStep ? '✓' : 
                   index === processingStep ? '⏳' : index + 1}
                </div>
                <span style={{ color: 'white', fontSize: '14px' }}>{step}</span>
                {index === processingStep && (
                  <div style={{ marginLeft: 'auto', color: '#60a5fa', fontSize: '12px' }}>
                    Processing...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost & Efficiency Comparison */}
      {batchMetrics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '24px' 
        }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              ❌ Individual Processing
            </h4>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              <div>• 5 separate SP1 proofs</div>
              <div>• 5 zkVerify transactions</div>
              <div>• Estimated cost: ~$50</div>
              <div>• Processing time: ~15 minutes</div>
              <div>• Total proof size: ~100KB</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              ✅ Batch Aggregation
            </h4>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              <div>• 1 aggregated SP1 proof</div>
              <div>• 1 zkVerify transaction</div>
              <div>• Actual cost: ~$6</div>
              <div>• Processing time: ~4 minutes</div>
              <div>• Compressed size: ~6KB</div>
            </div>
          </div>
        </div>
      )}

      {/* Efficiency Metrics */}
      {batchMetrics && (
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{ color: '#60a5fa', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            🎯 Batch Processing Results
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
                {batchMetrics.totalOrders}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Orders Processed</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {batchMetrics.cowMatches}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>CoW Matches</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {batchMetrics.gasSavings}%
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Gas Savings</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {batchMetrics.timeSaved}%
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Time Saved</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                {batchMetrics.proofSizeReduction}%
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Size Reduction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
