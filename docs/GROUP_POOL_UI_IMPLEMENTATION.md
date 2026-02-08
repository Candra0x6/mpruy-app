# Group Pool Frontend Implementation

This document explains the Group Pool UI implementation and how it integrates with the smart contracts and user flows.

## Overview

The Group Pool UI implements the complete user flow for collective betting on prediction markets using multi-signature wallets for governance.

### User Flow Summary

1. **Pool Initialization** → Create new pools linked to MultiSig wallets
2. **Member Onboarding** → Add members to the pool
3. **Group Funding** → Members deposit ETH or tokens
4. **Collective Betting** → Propose and execute stakes via MultiSig governance
5. **Winnings Distribution** → Automatically distribute winnings to members

## Project Structure

```
web/src/
├── app/
│   └── group-pool/
│       └── page.tsx              # Main Group Pool page with tabs
├── components/
│   └── group-pool/
│       ├── index.ts              # Component exports
│       ├── pool-dashboard.tsx     # View all pools & select
│       ├── create-pool-form.tsx   # Initialize new pool
│       ├── deposit-funds-form.tsx # Deposit ETH/tokens
│       ├── manage-members-form.tsx # Add/remove members
│       └── stake-in-market-form.tsx # Propose collective bets
├── hooks/
│   └── useGroupPool.ts           # Contract interaction hook
└── config/
    └── contracts.ts              # Contract addresses
```

## Component Details

### 1. Main Page (`/group-pool`)
- **Location**: `web/src/app/group-pool/page.tsx`
- **Purpose**: Container page with 5 main tabs
- **Features**:
  - Wallet connection check
  - Tab navigation between features
  - Pool selection state management

### 2. Pool Dashboard
- **Location**: `web/src/components/group-pool/pool-dashboard.tsx`
- **Purpose**: View all pools and select active pool
- **Features**:
  - Displays pool cards with key info
  - Shows member count and balance
  - Pool selection triggers other forms

### 3. Create Pool Form
- **Location**: `web/src/components/group-pool/create-pool-form.tsx`
- **Purpose**: Initialize new group pools
- **Fields**:
  - Pool name (text)
  - MultiSig wallet address (0x format)
  - Optional token address (0x format)
- **Contract Call**: `GroupPool.createPool()`

### 4. Deposit Funds Form
- **Location**: `web/src/components/group-pool/deposit-funds-form.tsx`
- **Purpose**: Members contribute to pool
- **Features**:
  - ETH deposit tab (active)
  - Token deposit tab (placeholder)
  - Pool balance display
  - Amount input with validation
  - Max button (ready for implementation)
- **Contract Calls**: `GroupPool.depositETH()` / `GroupPool.depositToken()`

### 5. Manage Members Form
- **Location**: `web/src/components/group-pool/manage-members-form.tsx`
- **Purpose**: Add/remove pool members
- **Features**:
  - Member count display
  - Add member input
  - Wallet address validation
  - Member guidelines reference
- **Contract Call**: `GroupPool.addMember()`

### 6. Stake in Market Form
- **Location**: `web/src/components/group-pool/stake-in-market-form.tsx`
- **Purpose**: Propose collective bets
- **Features**:
  - Market ID input
  - Outcome selection (Yes/No)
  - Stake amount input
  - Stake history tab (placeholder)
  - Flow explanation card
  - Warning about MultiSig governance
- **Contract Integration**:
  - Proposes to MultiSigWallet
  - MultiSig executes `PredictionMarket.placeStake()`

## Hook Integration

### useGroupPool Hook
**Location**: `web/src/hooks/useGroupPool.ts`

**Provides**:
```typescript
{
  // Queries
  getPool(poolId: bigint)           // Get pool details
  getMemberCount(poolId: bigint)    // Get member count
  
  // Mutations
  createPool(params)                // Create new pool
  depositEth(params)                // Deposit ETH
  addMember(params)                 // Add member
}
```

**Usage Pattern**:
```tsx
const { createPool, depositEth, addMember } = useGroupPool()

// Use in mutations
await createPool.mutateAsync({ 
  name, multiSig, token 
})
```

## UI Components Used

All components are from `web/src/components/ui/`:

- `button.tsx` - Action buttons
- `input.tsx` - Text/number inputs
- `label.tsx` - Form labels
- `card.tsx` - Content containers
- `tabs.tsx` - Tab navigation
- `skeleton.tsx` - Loading placeholders
- `badge.tsx` - Status indicators
- `radio-group.tsx` - Outcome selection
- `alert-dialog.tsx` - Confirmations
- `textarea.tsx` - Multi-line inputs (available)
- `select.tsx` - Dropdowns (available for markets)

## Styling

All components use **Tailwind CSS** with a dark theme:
- Background: `bg-slate-900/800`
- Text: `text-slate-200/300`
- Borders: `border-slate-700`
- Accents: `bg-blue-600`, `bg-green-600`, `bg-purple-600`

## Setup Instructions

### 1. Add Contract Addresses
Update `web/src/config/contracts.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  GroupPool: '0x...',        // Your deployed GroupPool address
  MultiSigWallet: '0x...',   // Your deployed MultiSigWallet address
  PredictionMarket: '0x...',  // Your deployed PredictionMarket address
}
```

### 2. Generate ABIs
Ensure wagmi codegen is configured to generate hooks for:
- `GroupPool`
- `MultiSigWallet`
- `PredictionMarket`

### 3. Install Required Dependencies
```bash
npm install react-hook-form viem wagmi @tanstack/react-query
npm install lucide-react  # For icons
```

### 4. Add Route to Navigation
Update main app layout to include link to `/group-pool`:
```tsx
<Link href="/group-pool">Group Pools</Link>
```

## Data Flow

### Creating a Pool
```
User Input → CreatePoolForm
    ↓
useGroupPool.createPool()
    ↓
Contract: GroupPool.createPool(name, multiSig, token)
    ↓
Success: Query invalidation → PoolDashboard refreshes
```

### Depositing Funds
```
User Input → DepositFundsForm
    ↓
useGroupPool.depositEth(poolId, amount)
    ↓
Contract: GroupPool.depositETH{ value: amount }
    ↓
Success: Balance updates in PoolDashboard
```

### Proposing a Stake
```
User Input → StakeInMarketForm
    ↓
Creates MultiSig Proposal
    ↓
MultiSig owners receive confirmation request
    ↓
Once threshold met: Executes PredictionMarket.placeStake()
    ↓
Pool's funds enter prediction market
```

## Future Enhancements

1. **Stake History Tab**
   - Query historical stakes from contract events
   - Display outcomes and winnings

2. **Max Button Implementation**
   - Fetch wallet balance
   - Use contract balance for deposits

3. **Token Support**
   - Implement ERC-20 deposit flow
   - Add token selection dropdown

4. **Winnings Claiming**
   - Add winnings distribution UI
   - Show claimable amounts per member

5. **Advanced Features**
   - Pool statistics and analytics
   - Betting history charts
   - Member contribution tracking
   - Performance metrics

## Testing Checklist

- [ ] Wallet connection flow
- [ ] Create pool form validation
- [ ] Add member address validation
- [ ] Deposit amount validation
- [ ] Stake proposal submission
- [ ] Error handling for failed transactions
- [ ] Success notifications
- [ ] Query refetching after mutations
- [ ] Tab navigation
- [ ] Responsive design on mobile
- [ ] Dark mode contrast compliance

## Troubleshooting

### Components Not Rendering
- Check if `CONTRACT_ADDRESSES` are set correctly
- Verify ABIs are generated correctly
- Ensure `useAccount` is connected

### Form Validation Errors
- Check regex patterns in `register()` calls
- Verify address format is `0x${string}`
- Ensure amounts are positive numbers

### Query Failures
- Verify contract addresses on current network
- Check if contracts are deployed
- Review console for error details

## Dependencies

- `react-hook-form` - Form state management
- `wagmi` - Wallet interaction
- `viem` - Contract interaction utilities
- `@tanstack/react-query` - Data fetching and caching
- `lucide-react` - Icon components
- `tailwindcss` - Styling

## License

This implementation is part of the EVM Prediction Market & Group Pooling project.
