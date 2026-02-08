# Smart Contract Deployment Guide

This guide explains how to deploy the smart contracts to different networks.

## Local Deployment (Anvil)

### Quick Start
```bash
cd contracts
./deploy.sh
```

This script will:
1. Check for Foundry installation
2. Build the contracts
3. Start an Anvil local blockchain (if not already running)
4. Deploy all contracts to the local network

### Output
The deployment will output contract addresses:
```
PredictionMarket: 0x...
MultiSigWallet: 0x...
GroupPool: 0x...
```

---

## Sepolia Testnet Deployment

### Prerequisites

1. **Foundry** - Install from https://book.getfoundry.sh/getting-started/installation

2. **Sepolia Testnet ETH** - Get test ETH from:
   - [Sepolia Faucet (Alchemy)](https://sepoliafaucet.com/)
   - [Sepolia Faucet (Infura)](https://www.infura.io/faucet/sepolia)
   - [Sepolia Faucet (QuickNode)](https://faucet.quicknode.com/ethereum/sepolia)

3. **Environment Variables** - Set up your `.env` file:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and fill in:
   # - SEPOLIA_RPC_URL (choose any public RPC or your own)
   # - PRIVATE_KEY (private key of deployment account)
   # - ETHERSCAN_API_KEY (optional, for verification)
   ```

### Setup Steps

1. **Get an RPC URL** (choose one):
   - [Infura](https://infura.io/) - Create project, get API key
   - [Alchemy](https://www.alchemy.com/) - Create app, get endpoint
   - [Public RPC](https://eth-sepolia-rpc.publicnode.com/) - Free public endpoint

2. **Set Environment Variables**:
   ```bash
   export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_API_KEY"
   export PRIVATE_KEY="your_private_key_here"
   export ETHERSCAN_API_KEY="your_etherscan_api_key"  # Optional
   ```

### Deploy

```bash
cd contracts
./deploy-sepolia.sh
```

This script will:
1. Check for required environment variables
2. Build the contracts
3. Deploy to Sepolia testnet
4. Verify contracts on Etherscan (if ETHERSCAN_API_KEY is set)

### Verification

Check deployment status:
```bash
# View transaction details
cat broadcast/DeployAll.s.sol/11155111/run-latest.json

# Check contract on Etherscan Sepolia
https://sepolia.etherscan.io/address/0x...
```

---

## Mainnet Deployment

**WARNING: Deploying to mainnet involves real ETH and risk of loss. Proceed only after thorough testing.**

To deploy to mainnet, modify the `deploy-sepolia.sh` script:

```bash
# Change RPC URL from Sepolia to Mainnet
MAINNET_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"

# Change deployment command
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url "$MAINNET_RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast
```

---

## Security Best Practices

1. **Never commit `.env` file** with real private keys
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template only

2. **Use a dedicated deployment account**
   - Create a new wallet specifically for deployments
   - Don't use accounts with large fund balances

3. **Verify contracts on Etherscan**
   - Enables transparency
   - Allows users to verify source code
   - Set `ETHERSCAN_API_KEY` for automatic verification

4. **Test thoroughly on testnet first**
   - Deploy to Sepolia before mainnet
   - Run full test suite: `forge test`
   - Verify all functionality

5. **Keep deployment records**
   - Save broadcast JSON files
   - Document contract deployment times
   - Track contract versions

---

## Troubleshooting

### "SEPOLIA_RPC_URL environment variable is not set"
```bash
export SEPOLIA_RPC_URL=https://eth-sepolia-rpc.publicnode.com
```

### "PRIVATE_KEY environment variable is not set"
```bash
export PRIVATE_KEY=your_hex_private_key
```

### Build fails with import errors
```bash
# Ensure dependencies are up to date
forge update
# Rebuild
forge build
```

### Gas estimation too high
- Check current Sepolia gas prices on [ETH Gas Station](https://www.ethgasstation.info/)
- May need to wait for lower gas periods to deploy

### Etherscan verification fails
- Ensure contract code is deterministic
- Check solidity version matches deployment
- Verify contract constructor arguments are correct

---

## Network Information

### Sepolia Testnet
- **Chain ID**: 11155111
- **Block Explorer**: https://sepolia.etherscan.io/
- **Native Token**: ETH (Sepolia testnet ETH, no real value)
- **Avg Block Time**: ~12 seconds
- **Typical Gas Price**: 1-10 gwei (highly variable)

### Mainnet Ethereum
- **Chain ID**: 1
- **Block Explorer**: https://etherscan.io/
- **Native Token**: ETH (real value)
- **Avg Block Time**: ~12 seconds
