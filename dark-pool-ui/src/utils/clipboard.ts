// Clipboard utilities for copying hashes and transaction data

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export interface HashInfo {
  label: string;
  hash: string;
  type: 'transaction' | 'proof' | 'zkverify' | 'sp1' | 'attestation';
  explorerUrl?: string;
  network?: string;
}

export const getExplorerUrl = (hash: string, type: string, network: string = 'zkverify'): string => {
  switch (network.toLowerCase()) {
    case 'zkverify':
    case 'polkadot':
      return `https://zkverify.subscan.io/tx/${hash}`;
    case 'ethereum':
      return `https://etherscan.io/tx/${hash}`;
    case 'sepolia':
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case 'polygon':
      return `https://polygonscan.com/tx/${hash}`;
    case 'arbitrum':
      return `https://arbiscan.io/tx/${hash}`;
    case 'base':
      return `https://basescan.org/tx/${hash}`;
    default:
      return `https://zkverify.subscan.io/tx/${hash}`;
  }
};

export const showCopyNotification = (message: string = 'Hash copied to clipboard!'): void => {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(16, 185, 129, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(16, 185, 129, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};
