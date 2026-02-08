#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Smart Contract Deployment to Ethereum Sepolia ===${NC}\n"

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo -e "${RED}Error: Foundry is not installed. Please install it first.${NC}"
    echo "Visit: https://book.getfoundry.sh/getting-started/installation"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Load .env file if it exists
if [ -f .env ]; then
    echo -e "${BLUE}Loading environment variables from .env...${NC}"
    set -a
    source .env
    set +a
fi

# Check for required environment variables
if [ -z "$SEPOLIA_RPC_URL" ]; then
    echo -e "${RED}Error: SEPOLIA_RPC_URL is not set.${NC}"
    echo -e "${YELLOW}Please configure it in .env file or set:${NC}"
    echo "export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    exit 1
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY is not set.${NC}"
    echo -e "${YELLOW}Please configure it in .env file or set:${NC}"
    echo "export PRIVATE_KEY=your_private_key_here"
    echo -e "${RED}WARNING: Never commit private keys to version control!${NC}"
    exit 1
fi

echo -e "${BLUE}Building contracts...${NC}"
forge build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}\n"

# Deploy all contracts to Sepolia
echo -e "${BLUE}Deploying contracts to Sepolia...${NC}"
echo -e "${YELLOW}RPC URL: $SEPOLIA_RPC_URL${NC}"
echo -e "${YELLOW}Chain ID: 11155111${NC}\n"

# Run deployment with verification
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url "$SEPOLIA_RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    --chain sepolia 2>&1

DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All contracts deployed successfully to Sepolia!${NC}"
    echo -e "${BLUE}Deployment details saved to broadcast/ directory${NC}"
else
    echo -e "\n${RED}✗ Deployment failed!${NC}"
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "1. Check RPC URL is correct: $SEPOLIA_RPC_URL"
    echo "2. Ensure you have Sepolia testnet ETH for gas fees"
    echo "3. Try a different RPC provider from SEPOLIA_SETUP.md"
    echo "4. Verify private key is in correct format (64 hex chars)"
    exit 1
fi
