# Quick Setup for Sepolia Deployment

## Step 1: Get a Free RPC Endpoint

### Option A: Infura (Recommended)
1. Go to https://www.infura.io/
2. Sign up (free tier available)
3. Create a new project
4. Select "Ethereum" and "Sepolia"
5. Copy your RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Option B: Alchemy
1. Go to https://www.alchemy.com/
2. Sign up (free tier available)
3. Create app → Select "Ethereum" → "Sepolia"
4. Copy your RPC URL from dashboard

### Option C: Ankr
1. Go to https://www.ankr.com/
2. Sign up (free tier)
3. Get your Sepolia RPC URL: `https://rpc.ankr.com/eth_sepolia`

## Step 2: Update .env File

Open `.env` and update:

```bash
# Using Infura
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Or using Alchemy
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Or using Ankr
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
```

Also ensure `PRIVATE_KEY` is set with your private key (hex format, without "0x" prefix).

## Step 3: Deploy

```bash
bash deploy-sepolia.sh
```

## Step 4: Check Results

Once deployment succeeds, check the addresses in the output and view on:
- https://sepolia.etherscan.io/address/CONTRACT_ADDRESS

---

## Troubleshooting

### Still getting HTTP errors?
- Check your RPC URL is correct
- Ensure you have Sepolia testnet ETH for gas fees
- Try a different RPC provider

### Get Sepolia Testnet ETH
- [Sepoliafaucet.com](https://sepoliafaucet.com/) - Connect Ethereum wallet
- [Infura Faucet](https://www.infura.io/faucet/sepolia) - Free Sepolia ETH
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### Private Key Format
- Should be 64 hex characters (no "0x" prefix)
- Example: `51dc5c86815cbe9d97e101d2a6175b451b178aa59f06c91f82f87228472c3a1c`
- **NEVER share your private key!**
