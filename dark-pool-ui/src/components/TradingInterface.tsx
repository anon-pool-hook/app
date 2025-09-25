import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { TOKENS, CONTRACTS } from '../config/wagmi';
import { formatEther, parseEther } from 'viem';
import { useDarkCoWHook, useTransactionReceipt } from '../hooks/useContracts';
import { generateZKProof } from '../utils/zkProof';
import { TransactionStatus } from './TransactionStatus';

interface TradingInterfaceProps {
  onTradeSubmit: (trade: any) => void;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ onTradeSubmit }) => {
  const { address } = useAccount();
  const { submitPrivateOrder, hash, error, isPending } = useDarkCoWHook();
  const { data: receipt, isLoading: isReceiptLoading } = useTransactionReceipt(hash);
  
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [minReceive, setMinReceive] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isPrivateOrder, setIsPrivateOrder] = useState(true);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  const tokens = Object.values(TOKENS);

  const handleSubmitTrade = async () => {
    if (!amount || !minReceive || !address) return;

    const tradeData = {
      type: tradeType,
      fromToken,
      toToken,
      amount,
      minReceive,
      slippage,
      isPrivate: isPrivateOrder,
      timestamp: Date.now(),
      userAddress: address,
    };

    try {
      if (isPrivateOrder) {
        // Generate ZK proof and submit through hook
        onTradeSubmit(tradeData);
      } else {
        // Direct submission without privacy
        const tokenInAddress = TOKENS[fromToken as keyof typeof TOKENS]?.address || CONTRACTS.TOKEN0;
        const tokenOutAddress = TOKENS[toToken as keyof typeof TOKENS]?.address || CONTRACTS.TOKEN1;
        
        await submitPrivateOrder({
          tokenIn: tokenInAddress,
          tokenOut: tokenOutAddress,
          amountSpecified: parseEther(amount),
          commitment: `0x${'0'.repeat(64)}`, // Empty commitment for public orders
          nullifierHash: `0x${'0'.repeat(64)}`, // Empty nullifier for public orders  
          proof: '0x' // Empty proof for public orders
        });
        
        if (hash) {
          setLastTxHash(hash);
        }
      }
    } catch (err) {
      console.error('Trade submission failed:', err);
    }
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
    setMinReceive('');
  };

  return (
    <div className="space-y-6">
      {/* Trading Type Selector */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Private Trading</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Private Order</span>
            <button
              onClick={() => setIsPrivateOrder(!isPrivateOrder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPrivateOrder ? 'bg-accent-500' : 'bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPrivateOrder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Trade Type Buttons */}
        <div className="flex p-1 bg-dark-700 rounded-lg mb-6">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-success text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'sell'
                ? 'bg-danger text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        {/* From Token */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">From</label>
            <span className="text-sm text-gray-400">Balance: 10.5 {fromToken}</span>
          </div>
          <div className="flex space-x-3">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white min-w-[120px]"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="input-field"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={swapTokens}
            className="w-10 h-10 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">To</label>
            <span className="text-sm text-gray-400">Balance: 2,450 {toToken}</span>
          </div>
          <div className="flex space-x-3">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white min-w-[120px]"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={minReceive}
              onChange={(e) => setMinReceive(e.target.value)}
              placeholder="0.0"
              className="input-field"
            />
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">Slippage Tolerance</label>
            <span className="text-sm text-accent-500">{slippage}%</span>
          </div>
          <div className="flex space-x-2">
            {['0.1', '0.5', '1.0'].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  slippage === value
                    ? 'bg-accent-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                {value}%
              </button>
            ))}
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-20 bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm text-white"
              step="0.1"
              min="0.1"
              max="50"
            />
          </div>
        </div>

        {/* Privacy Notice */}
        {isPrivateOrder && (
          <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span className="text-sm text-accent-400 font-medium">Zero-Knowledge Privacy Enabled</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your order amount and balance will be hidden using SP1 proofs. Only execution is visible on-chain.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitTrade}
          disabled={!amount || !minReceive}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
            tradeType === 'buy'
              ? 'btn-primary bg-success hover:bg-green-600'
              : 'bg-danger hover:bg-red-600 text-white'
          }`}
        >
          {isPrivateOrder ? '🔒 ' : ''}
          {tradeType === 'buy' ? 'Submit Private Buy Order' : 'Submit Private Sell Order'}
        </button>
      </div>

      {/* Order Summary */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Trade Type:</span>
            <span className={tradeType === 'buy' ? 'text-success' : 'text-danger'}>
              {tradeType.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <span>{amount || '0'} {fromToken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">To (minimum):</span>
            <span>{minReceive || '0'} {toToken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Slippage:</span>
            <span>{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Privacy Mode:</span>
            <span className={isPrivateOrder ? 'text-accent-500' : 'text-warning'}>
              {isPrivateOrder ? 'Private (ZK)' : 'Public'}
            </span>
          </div>
          <div className="flex justify-between border-t border-dark-600 pt-3">
            <span className="text-gray-400">Estimated Gas:</span>
            <span className="text-success">~0.003 ETH</span>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {(hash || lastTxHash) && (
        <TransactionStatus
          hash={hash || lastTxHash}
          status={
            isPending || isReceiptLoading
              ? 'pending'
              : receipt
              ? 'success'
              : error
              ? 'failed'
              : 'pending'
          }
          onClose={() => {
            setLastTxHash('');
          }}
        />
      )}
    </div>
  );
};
