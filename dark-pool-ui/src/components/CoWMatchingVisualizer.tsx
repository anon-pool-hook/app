import React, { useState, useEffect } from 'react';

interface TradeFlow {
  id: string;
  from: { token: string; amount: string; user: string };
  to: { token: string; amount: string; user: string };
  matchType: 'direct' | 'partial' | 'amm';
  savings?: number;
  status: 'pending' | 'active' | 'completed';
}

export const CoWMatchingVisualizer: React.FC = () => {
  const [flows, setFlows] = useState<TradeFlow[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    'Scanning order pool for matches',
    'Identifying complementary trades',
    'Optimizing execution paths',
    'Calculating gas savings'
  ];

  const findMatches = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setFlows([]);

    // Production CoW matching algorithm
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
    }

    // Generate matching flows
    const matchingFlows: TradeFlow[] = [
      {
        id: '1',
        from: { token: 'ETH', amount: '2.5', user: 'Alice' },
        to: { token: 'USDC', amount: '5,125', user: 'Bob' },
        matchType: 'direct',
        savings: 87,
        status: 'completed'
      },
      {
        id: '2', 
        from: { token: 'USDC', amount: '5,100', user: 'Bob' },
        to: { token: 'ETH', amount: '2.48', user: 'Alice' },
        matchType: 'direct',
        savings: 87,
        status: 'completed'
      },
      {
        id: '3',
        from: { token: 'DAI', amount: '2,050', user: 'Charlie' },
        to: { token: 'USDC', amount: '2,045', user: 'Dave' },
        matchType: 'partial',
        savings: 45,
        status: 'completed'
      },
      {
        id: '4',
        from: { token: 'ETH', amount: '1.0', user: 'Emma' },
        to: { token: 'DAI', amount: '2,100', user: 'AMM Pool' },
        matchType: 'amm',
        status: 'completed'
      }
    ];

    setFlows(matchingFlows);
    setIsAnalyzing(false);
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'direct': return '#10b981';
      case 'partial': return '#f59e0b'; 
      case 'amm': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'direct': return '🤝';
      case 'partial': return '🔄';
      case 'amm': return '🏊';
      default: return '📊';
    }
  };

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(55, 65, 81, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
          🤝 CoW Matching Analysis
        </h3>
        <button
          onClick={findMatches}
          disabled={isAnalyzing}
          style={{
            backgroundColor: isAnalyzing ? '#6b7280' : '#10b981',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {isAnalyzing ? '🔍 Analyzing...' : '🔍 Find Matches'}
        </button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
              Analysis Progress: {currentStep + 1}/{analysisSteps.length}
            </div>
            <div style={{ 
              width: '100%', 
              height: '6px', 
              backgroundColor: 'rgba(55, 65, 81, 0.5)', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${((currentStep + 1) / analysisSteps.length) * 100}%`, 
                height: '100%', 
                backgroundColor: '#10b981',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
          <div style={{ color: '#60a5fa', fontSize: '12px' }}>
            {analysisSteps[currentStep]}...
          </div>
        </div>
      )}

      {/* Matching Results */}
      {flows.length > 0 && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '16px',
            marginBottom: '20px'
          }}>
            {flows.map((flow) => (
              <div
                key={flow.id}
                style={{
                  backgroundColor: 'rgba(55, 65, 81, 0.3)',
                  border: `1px solid ${getMatchTypeColor(flow.matchType)}40`,
                  borderRadius: '8px',
                  padding: '16px',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '20px'
                }}>
                  {getMatchTypeIcon(flow.matchType)}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    color: getMatchTypeColor(flow.matchType),
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {flow.matchType} Match
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                      {flow.from.user}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
                      {flow.from.amount} {flow.from.token}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '4px 8px',
                    backgroundColor: getMatchTypeColor(flow.matchType) + '20',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}>
                    ↔️
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                      {flow.to.user}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
                      {flow.to.amount} {flow.to.token}
                    </div>
                  </div>
                </div>

                {flow.savings && (
                  <div style={{ 
                    textAlign: 'center',
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '4px',
                    color: '#10b981',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    💰 {flow.savings}% gas savings
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              🎯 CoW Matching Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', fontSize: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                  {flows.filter(f => f.matchType === 'direct').length}
                </div>
                <div style={{ color: '#9ca3af' }}>Direct Matches</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>
                  {flows.filter(f => f.matchType === 'partial').length}
                </div>
                <div style={{ color: '#9ca3af' }}>Partial Fills</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#6366f1', fontSize: '20px', fontWeight: 'bold' }}>
                  {flows.filter(f => f.matchType === 'amm').length}
                </div>
                <div style={{ color: '#9ca3af' }}>AMM Routes</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                  {Math.round(flows.reduce((acc, f) => acc + (f.savings || 0), 0) / flows.length)}%
                </div>
                <div style={{ color: '#9ca3af' }}>Avg Savings</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
