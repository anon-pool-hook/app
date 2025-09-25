import React, { useState, useEffect } from 'react';

interface ZKProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeData: any;
}

type ProofStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  technical?: string;
  hash?: string;
};

export const ZKProofModal: React.FC<ZKProofModalProps> = ({ isOpen, onClose, tradeData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ProofStep[]>([
    {
      id: 'commitment',
      title: 'Creating Order Commitment',
      description: 'Generating cryptographic commitment for your order',
      status: 'pending',
      technical: 'Computing Pedersen commitment with order data + secret nullifier'
    },
    {
      id: 'nullifier',
      title: 'Computing Nullifier Hash',
      description: 'Creating unique nullifier to prevent double-spending',
      status: 'pending',
      technical: 'H(nullifier_secret) → prevents order replay attacks'
    },
    {
      id: 'merkle',
      title: 'Building Merkle Proof',
      description: 'Adding your commitment to the privacy tree',
      status: 'pending',
      technical: 'Merkle inclusion proof for commitment hash'
    },
    {
      id: 'sp1-proof',
      title: 'Generating SP1 ZK Proof',
      description: 'Creating zero-knowledge proof of valid execution',
      status: 'pending',
      technical: 'SP1 zkVM proving order validity without revealing amounts'
    },
    {
      id: 'zkverify',
      title: 'Submitting to zkVerify',
      description: 'Verifying proof on zkVerify blockchain',
      status: 'pending',
      technical: 'Blockchain verification of SP1 proof for immutable receipt'
    },
    {
      id: 'execution',
      title: 'Executing Trade',
      description: 'Executing swap with privacy guarantees',
      status: 'pending',
      technical: 'Uniswap V4 hook execution with verified proof',
      hash: '0x1234567890abcdef...'
    }
  ]);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate the proof generation process
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Update step to processing
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'processing' } : step
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

        // Update step to completed
        setSteps(prev => prev.map((step, index) => 
          index === i ? { 
            ...step, 
            status: 'completed',
            hash: index === steps.length - 1 ? '0x8fa123b...' : undefined
          } : step
        ));
      }
    };

    processSteps();
  }, [isOpen]);

  if (!isOpen) return null;

  const getStepIcon = (status: ProofStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        );
      case 'failed':
        return (
          <div className="w-8 h-8 bg-danger rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-dark-500 rounded-full"></div>
          </div>
        );
    }
  };

  const allCompleted = steps.every(step => step.status === 'completed');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Zero-Knowledge Proof Generation</h2>
            <p className="text-gray-400">Processing your private trade with cryptographic guarantees</p>
          </div>
          <button
            onClick={onClose}
            disabled={!allCompleted}
            className="w-8 h-8 bg-dark-700 hover:bg-dark-600 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Trade Summary */}
        <div className="bg-dark-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Trade Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className={`ml-2 ${tradeData?.type === 'buy' ? 'text-success' : 'text-danger'}`}>
                {tradeData?.type?.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Pair:</span>
              <span className="ml-2">{tradeData?.fromToken}/{tradeData?.toToken}</span>
            </div>
            <div>
              <span className="text-gray-400">Amount:</span>
              <span className="ml-2 font-mono">••••••</span>
              <span className="text-xs text-accent-500 ml-2">Hidden</span>
            </div>
            <div>
              <span className="text-gray-400">Privacy:</span>
              <span className="ml-2 text-accent-500">Zero-Knowledge</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className={`border-l-4 pl-4 py-3 ${
              step.status === 'completed' ? 'border-success bg-success/5' :
              step.status === 'processing' ? 'border-accent-500 bg-accent-500/5' :
              step.status === 'failed' ? 'border-danger bg-danger/5' :
              'border-dark-600 bg-dark-800/50'
            } rounded-r-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStepIcon(step.status)}
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                {step.status === 'processing' && (
                  <div className="text-sm text-accent-500 animate-pulse">
                    Processing...
                  </div>
                )}
                
                {step.status === 'completed' && (
                  <div className="text-sm text-success">
                    ✓ Complete
                  </div>
                )}
              </div>

              {/* Technical Details (Expandable) */}
              {step.technical && (
                <div className="mt-3 bg-dark-900 rounded-lg p-3">
                  <p className="text-xs font-mono text-gray-400">{step.technical}</p>
                  {step.hash && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Transaction Hash:</span>
                      <p className="text-xs font-mono text-accent-500 break-all">{step.hash}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {allCompleted && (
          <div className="mt-6 bg-success/10 border border-success/30 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-success">Trade Executed Successfully!</h3>
                <p className="text-sm text-gray-400">Your private trade has been completed with full privacy guarantees.</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.open(`https://etherscan.io/tx/${steps[steps.length-1].hash}`, '_blank')}
                className="btn-secondary text-sm py-2"
              >
                View on Explorer
              </button>
              <button
                onClick={onClose}
                className="btn-primary text-sm py-2"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Privacy Guarantee */}
        <div className="mt-6 bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-accent-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <div>
              <h4 className="font-semibold text-accent-400 mb-1">Privacy Guarantees</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Order amounts are cryptographically hidden</li>
                <li>• Balance information never revealed on-chain</li>
                <li>• SP1 proofs ensure mathematical validity</li>
                <li>• Only execution result is publicly visible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
