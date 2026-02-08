# MPRUY - Multi-Protocol Risk-Unified Yield

A complete Web3 DeFi application with smart contracts and Next.js frontend.

## 📁 Monorepo Structure

```
mpruy/
├── contracts/          # Solidity smart contracts (Foundry)
├── web/               # Next.js frontend application
├── docs/              # Documentation
├── package.json       # Root workspace configuration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Foundry (for contracts)
- Git

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Start web application in development mode
npm run dev

# Or directly in web workspace
cd web && npm run dev
```

### Building

```bash
# Build both contracts and web
npm run build

# Build only contracts
npm run contracts:build

# Build only web
npm run web:build
```

### Testing

```bash
# Run contract tests
npm run contracts:test
```

### Deployment

```bash
# Deploy to Sepolia testnet
npm run contracts:deploy-sepolia

# Or use local deployment
npm run contracts:deploy
```

## 📦 Workspaces

### Contracts (`./contracts`)
Smart contract implementations using Foundry
- **GroupPool.sol** - Liquidity pooling mechanism
- **MultiSigWallet.sol** - Multi-signature wallet
- **PredictionMarket.sol** - Prediction market platform
- **MockToken.sol** - Testing utility token

[See contracts README](./contracts/README.md)

### Web (`./web`)
Next.js frontend application with Wagmi integration
- Modern React components with Tailwind CSS
- Web3 integration using Wagmi
- Multi-page app with:
  - Group Pool interface
  - Multi-Sig Wallet management
  - Prediction Market interface

[See web README](./web/README.md)

## 🔧 Available Scripts

### Root Level

```bash
npm run contracts:build       # Build smart contracts
npm run contracts:test        # Run contract tests
npm run contracts:deploy      # Deploy to local network
npm run contracts:deploy-sepolia  # Deploy to Sepolia testnet
npm run web:dev              # Start web dev server
npm run web:build            # Build web for production
npm run web:start            # Start web production server
npm run web:lint             # Lint web code
npm run build                # Build both contracts and web
npm run clean                # Clean build artifacts
```

## 🌐 Deployment

### Sepolia Testnet Deployment

1. Configure environment variables:
```bash
cd contracts
cp .env.sepolia.example .env

# Edit .env with:
# - SEPOLIA_RPC_URL
# - PRIVATE_KEY
# - ETHERSCAN_API_KEY
```

2. Deploy contracts:
```bash
npm run contracts:deploy-sepolia
```

3. Update web configuration with deployed contract addresses

## 📝 Documentation

- [Contract Architecture](./docs/ARCHITECTURE_AND_INTEGRATION.md)
- [Sepolia Setup Guide](./contracts/SEPOLIA_SETUP.md)
- [Deployment Guide](./contracts/DEPLOYMENT.md)
- [Group Pool Implementation](./docs/GROUP_POOL_IMPLEMENTATION_CHECKLIST.md)
- [Multi-Sig Wallet Architecture](./docs/MULTISIG_ARCHITECTURE.md)
- [Prediction Market Architecture](./docs/PREDICTION_MARKET_ARCHITECTURE.md)

## 🧪 Testing

```bash
# Run all contract tests
npm run contracts:test

# Run specific test
cd contracts && forge test --match ContractName
```

## 🔐 Security

- Private keys should never be committed
- Use environment variables for sensitive data
- See `.env.sepolia.example` for configuration template

## 📄 License

MIT

## 🤝 Contributing

1. Create a branch for your feature
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

---

**Built with:**
- ⚙️ [Foundry](https://book.getfoundry.sh/) - Smart contract development
- ⚛️ [Next.js](https://nextjs.org/) - React framework
- 🌐 [Wagmi](https://wagmi.sh/) - Web3 hooks library
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Styling
