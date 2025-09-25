import React from 'react';

interface TransactionStatusProps {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  onClose: () => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ hash, status, onClose }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-danger" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending';
      case 'success':
        return 'Transaction Successful';
      case 'failed':
        return 'Transaction Failed';
      default:
        return '';
    }
  };

  return (
    <div className="trading-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaction Status</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-dark-700 hover:bg-dark-600 rounded flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {getStatusIcon()}
        <div>
          <p className="font-semibold">{getStatusText()}</p>
          <p className="text-sm text-gray-400">
            {status === 'pending' && 'Waiting for confirmation...'}
            {status === 'success' && 'Your trade has been executed successfully'}
            {status === 'failed' && 'Your transaction was reverted'}
          </p>
        </div>
      </div>

      <div className="bg-dark-700 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-accent-500 break-all">{hash}</p>
          <button
            onClick={() => navigator.clipboard.writeText(hash)}
            className="ml-2 p-1 hover:bg-dark-600 rounded"
            title="Copy hash"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => window.open(`https://etherscan.io/tx/${hash}`, '_blank')}
          className="btn-secondary flex-1 text-sm py-2"
        >
          View on Explorer
        </button>
        {status === 'success' && (
          <button
            onClick={onClose}
            className="btn-primary flex-1 text-sm py-2"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
