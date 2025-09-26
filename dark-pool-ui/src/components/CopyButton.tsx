import React, { useState } from 'react';
import { copyToClipboard, getExplorerUrl, showCopyNotification } from '../utils/clipboard';

interface CopyButtonProps {
  text: string;
  label?: string;
  type?: 'transaction' | 'proof' | 'zkverify' | 'sp1' | 'attestation';
  network?: string;
  showExplorerLink?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Hash',
  type = 'transaction',
  network = 'zkverify',
  showExplorerLink = true,
  size = 'medium',
  style = {}
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      showCopyNotification(`${label} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExplorerClick = () => {
    const url = getExplorerUrl(text, type, network);
    window.open(url, '_blank');
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '4px 8px', fontSize: '11px' };
      case 'large':
        return { padding: '10px 16px', fontSize: '14px' };
      default:
        return { padding: '6px 12px', fontSize: '12px' };
    }
  };

  const baseButtonStyle = {
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    ...getSizeStyles(),
    ...style
  };

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <button
        onClick={handleCopy}
        style={{
          ...baseButtonStyle,
          backgroundColor: copied ? '#10b981' : '#374151',
          color: 'white',
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.backgroundColor = '#374151';
          }
        }}
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <span>📋</span>
            <span>Copy {label}</span>
          </>
        )}
      </button>

      {showExplorerLink && text.startsWith('0x') && (
        <button
          onClick={handleExplorerClick}
          style={{
            ...baseButtonStyle,
            backgroundColor: '#2563eb',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          title={`View on ${network === 'zkverify' ? 'zkVerify Subscan' : network}`}
        >
          <span>🔗</span>
          <span>View on {network === 'zkverify' ? 'Subscan' : network}</span>
        </button>
      )}
    </div>
  );
};

export const InlineCopyHash: React.FC<{
  hash: string;
  label?: string;
  maxLength?: number;
  type?: string;
  network?: string;
}> = ({ 
  hash, 
  label = 'Hash', 
  maxLength = 20,
  type = 'transaction',
  network = 'zkverify'
}) => {
  const displayHash = hash.length > maxLength ? 
    `${hash.slice(0, maxLength)}...` : hash;

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '4px 8px',
      backgroundColor: 'rgba(55, 65, 81, 0.5)',
      borderRadius: '6px',
      border: '1px solid rgba(75, 85, 99, 0.5)'
    }}>
      <span style={{ 
        fontFamily: 'monospace', 
        fontSize: '12px', 
        color: '#60a5fa' 
      }}>
        {displayHash}
      </span>
      <button
        onClick={async () => {
          const success = await copyToClipboard(hash);
          if (success) {
            showCopyNotification(`${label} copied!`);
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '12px',
          padding: '2px'
        }}
        title={`Copy ${label}`}
      >
        📋
      </button>
      {hash.startsWith('0x') && (
        <button
          onClick={() => {
            const url = getExplorerUrl(hash, type, network);
            window.open(url, '_blank');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#60a5fa',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '2px'
          }}
          title={`View on ${network === 'zkverify' ? 'zkVerify Subscan' : network}`}
        >
          🔗
        </button>
      )}
    </div>
  );
};
