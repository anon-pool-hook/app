# Dark Pool DEX UI

A beautiful, privacy-first decentralized exchange interface built with React, TypeScript, and modern Web3 technologies.

## 🌊 Features

- **Zero-Knowledge Privacy**: Trade without revealing order amounts using SP1 proofs
- **Modern UI**: Beautiful dark theme with glassmorphism effects
- **Wallet Integration**: Seamless connection with MetaMask and other Web3 wallets
- **Real-time Order Book**: Live display of private orders with hidden amounts
- **ZK Proof Visualization**: Interactive modal showing the cryptographic process
- **Transaction Tracking**: Real-time status updates and blockchain verification

## 🚀 Quick Start

```bash
# Install dependencies
cd dark-pool-ui
npm install

# Start development server
npm start
```

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Beautiful wallet connection
- **Framer Motion** - Smooth animations
- **Viem** - TypeScript Ethereum library

## 🎨 Design System

### Colors
- **Dark Theme**: Deep blues and purples for a professional trading interface
- **Accent Colors**: Vibrant blue (#667eea) for interactive elements
- **Status Colors**: Green (success), Red (danger), Yellow (warning)

### Components
- **Trading Cards**: Glassmorphism effect with subtle borders
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Modals**: Backdrop blur with smooth animations

## 🔐 Privacy Features

### Zero-Knowledge Proofs
- SP1 proof generation for order privacy
- zkVerify blockchain verification
- Cryptographic commitments and nullifiers

### Hidden Order Book
- Trader addresses visible for transparency
- Order amounts completely hidden
- Privacy status indicators

## 🌐 Integration

### Smart Contracts
- **Dark CoW Hook**: Privacy-preserving trading hook
- **Order Service Manager**: EigenLayer AVS integration
- **Pool Manager**: Uniswap V4 integration

### Supported Networks
- Anvil (Local Development)
- Holesky Testnet (Ready for deployment)

## 📱 Responsive Design

The interface is fully responsive and works across:
- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## ⚡ Performance

- Lazy loading for modals and heavy components
- Optimized re-renders with React.memo
- Efficient state management with minimal context
- Fast wallet connections with RainbowKit

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview build locally
npx serve -s build
```

## 📖 Architecture

```
src/
├── components/          # React components
│   ├── DarkPoolApp.tsx    # Main application
│   ├── TradingInterface.tsx # Trading form
│   ├── OrderBook.tsx      # Order book display
│   ├── ZKProofModal.tsx   # ZK proof visualization
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useContracts.ts   # Smart contract interactions
│   └── ...
├── utils/              # Utility functions
│   ├── zkProof.ts        # ZK proof generation
│   └── ...
├── config/             # Configuration
│   ├── wagmi.ts          # Web3 configuration
│   └── ...
└── styles/             # Styling
    ├── index.css         # Global styles
    └── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

Built with ❤️ for the zkVerify Hackathon
