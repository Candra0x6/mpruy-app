#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Smart Contract Deployment Script ===${NC}\n"

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo -e "${RED}Error: Foundry is not installed. Please install it first.${NC}"
    echo "Visit: https://book.getfoundry.sh/getting-started/installation"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo -e "${BLUE}Building contracts...${NC}"
cd "$SCRIPT_DIR"
forge build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}\n"

# Check if Anvil is running
if ! nc -z localhost 8545 2>/dev/null; then
    echo -e "${BLUE}Starting Anvil local network...${NC}"
    anvil &
    ANVIL_PID=$!
    sleep 2
    echo -e "${GREEN}✓ Anvil started (PID: $ANVIL_PID)${NC}\n"
fi

# Deploy all contracts
echo -e "${BLUE}Deploying all contracts...${NC}"
forge script script/DeployAll.s.sol:DeployAll --rpc-url http://localhost:8545 --broadcast

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ All contracts deployed successfully!${NC}"
else
    echo -e "\n${RED}Deployment failed!${NC}"
    exit 1
fi
