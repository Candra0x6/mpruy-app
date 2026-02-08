# Prediction Market Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │           Prediction Market UI (Next.js)             │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │        Main Page (5 Tabs Navigation)            │ │   │
│  │  │  ├─ Dashboard (Overview & Stats)                │ │   │
│  │  │  ├─ Create Market (Form & Validation)           │ │   │
│  │  │  ├─ Active Markets (Browse & Stake)             │ │   │
│  │  │  ├─ My Stakes (User's Positions)                │ │   │
│  │  │  └─ Resolved Markets (Claim Winnings)           │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (Wagmi + Viem)
┌─────────────────────────────────────────────────────────────┐
│              Blockchain Layer (Ethereum/Anvil)             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │      PredictionMarket Smart Contract                 │   │
│  │  ├─ createMarket(description, token, block, cond)    │   │
│  │  ├─ placeStake(marketId, outcome, amount)            │   │
│  │  ├─ withdrawWinnings(marketId)                       │   │
│  │  ├─ adminResolveMarket(marketId, outcome)            │   │
│  │  ├─ getMarket(marketId) → Market struct              │   │
│  │  ├─ getUserStake(marketId, user) → Stake struct      │   │
│  │  └─ getMarketCount() → uint256                       │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Create Market Flow
```
┌─────────────────────────────────────────────────────────────┐
│ User fills Create Market Form                               │
│ ├─ description: "Will Bitcoin reach $100k?"                │
│ ├─ resolution: "30" (days)                                  │
│ └─ condition: "1" (condition number)                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Form Validation                                             │
│ ├─ description.length >= 10 ✓                               │
│ ├─ resolution ∈ [1, 365] ✓                                  │
│ └─ condition ∈ [1, 10] ✓                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Data Transformation                                         │
│ resolutionBlock = now + (30 days) = block number           │
│ condition = BigInt(1)                                       │
│ tokenAddress = CONTRACT_ADDRESSES.Token                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Contract Call via Wagmi                                     │
│ createMarket.mutateAsync({                                  │
│   description: "Will Bitcoin reach $100k?",                │
│   tokenAddress: "0x...",                                    │
│   resolutionBlock: 17892340,                                │
│   condition: 1n                                             │
│ })                                                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ React Query Mutation                                        │
│ ├─ setStatus('loading')                                     │
│ ├─ Send transaction to blockchain                           │
│ ├─ Wait for confirmation                                    │
│ └─ Invalidate 'markets' cache key                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Success Feedback                                            │
│ ├─ setStatus('success')                                     │
│ ├─ Show success message for 3 seconds                       │
│ ├─ Reset form fields                                        │
│ └─ Refresh dashboard market count                           │
└─────────────────────────────────────────────────────────────┘
```

### 2. Place Stake Flow
```
┌─────────────────────────────────────────────────────────────┐
│ User selects Market & fills Stake Form                      │
│ ├─ marketId: 0                                              │
│ ├─ amount: "0.5" ETH                                        │
│ └─ outcome: "YES" (PredictionOutcome.Yes = 0)              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Form Validation                                             │
│ ├─ marketId valid: marketId < marketCount ✓               │
│ ├─ amount > 0 ETH ✓                                         │
│ └─ outcome ∈ {Yes, No} ✓                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Data Transformation                                         │
│ marketId = BigInt(0)                                        │
│ outcome = PredictionOutcome.Yes (0)                         │
│ amount = parseEther("0.5") = 500000000000000000n           │
│ isEth = true                                                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Contract Call with ETH Value                                │
│ placeStake.mutateAsync({                                    │
│   marketId: 0n,                                             │
│   outcome: 0,          // YES                               │
│   amount: 500000000000000000n,                              │
│   value: 500000000000000000n    // ETH sent                │
│ })                                                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ React Query Mutation + Cache Invalidation                   │
│ ├─ setStatus('loading')                                     │
│ ├─ Send transaction with value                              │
│ ├─ Invalidate 'markets' & 'stakes' keys                     │
│ └─ Refetch user stakes data                                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Success & UI Update                                         │
│ ├─ Show "Stake placed on YES successfully!"                │
│ ├─ Update My Stakes tab with new stake                      │
│ ├─ Refresh market statistics                                │
│ └─ Reset form fields                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3. Claim Winnings Flow
```
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Claim" button on resolved market               │
│ marketId: 2 (example resolved market)                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Pre-check Conditions                                        │
│ ├─ Market is resolved (outcome determined) ✓               │
│ ├─ User predicted correct outcome ✓                         │
│ ├─ Winnings not yet claimed ✓                               │
│ └─ Within claim window (30 days) ✓                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Contract Call                                               │
│ withdrawWinnings.mutateAsync(BigInt(2))                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Smart Contract Execution                                    │
│ ├─ Verify user's stake on winning side                      │
│ ├─ Calculate winnings:                                      │
│ │  losing_pool / winning_count * user_stake               │
│ ├─ Transfer ETH to user wallet                              │
│ └─ Mark winnings as claimed                                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ React Query Update                                          │
│ ├─ Invalidate 'stakes' cache key                            │
│ ├─ Refetch resolved markets                                 │
│ └─ Update winnings display                                  │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Success Confirmation                                        │
│ ├─ Show "Winnings claimed successfully!"                    │
│ ├─ Update wallet balance                                    │
│ ├─ Mark market as "Claimed" in UI                           │
│ └─ Move market to history                                   │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
PredictionMarketPage (Main Entry)
├─ Wallet Connection Check
├─ Tabs Container (5 TabsTriggers)
│
├─ Tab 1: Dashboard
│  └─ MarketDashboard
│     ├─ Total Markets Card (uses marketCount query)
│     ├─ Market Status Card
│     ├─ Recent Activity Card
│     ├─ How It Works Info Card
│     └─ Quick Start Buttons
│
├─ Tab 2: Create Market
│  └─ CreateMarketForm
│     ├─ Description TextArea (with validation)
│     ├─ Resolution Input (days, 1-365)
│     ├─ Condition Input (1-10)
│     ├─ Submit Button (loading state)
│     ├─ Success/Error Card
│     └─ Market Lifecycle Sidebar
│
├─ Tab 3: Active Markets
│  ├─ MarketList (left side)
│  │  └─ Market Cards (selectable)
│  │     ├─ Market ID
│  │     ├─ Status Badge
│  │     └─ Description
│  │
│  └─ StakeForm (right sidebar)
│     ├─ Market ID Display
│     ├─ Amount Input (with validation)
│     ├─ YES/NO RadioGroup
│     ├─ Submit Button (loading state)
│     └─ Success/Error Card
│
├─ Tab 4: My Stakes
│  ├─ TabsContainer (All/Pending/Settled)
│  │  ├─ Tab: All Stakes
│  │  │  └─ StakeCards (list)
│  │  ├─ Tab: Pending
│  │  │  └─ FilteredStakeCards
│  │  └─ Tab: Settled
│  │     └─ FilteredStakeCards
│  │
│  └─ StakesSummary Sidebar
│     ├─ Total Staked Card
│     ├─ Win Rate Card
│     └─ Potential Winnings Card
│
└─ Tab 5: Resolved Markets
   ├─ SearchInput (top)
   ├─ TabsContainer (All/Won/Lost)
   │  └─ ResolvedMarketCards
   │     ├─ Market Outcome (YES/NO)
   │     ├─ Stake Amount
   │     ├─ Winnings Amount
   │     └─ Claim Button (if unclaimed)
   │
   └─ PayoutRules Card
```

## State Management Strategy

### Component State (useState)
```typescript
// Form Status
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [message, setMessage] = useState('')

// Market Selection
const [selectedMarketId, setSelectedMarketId] = useState<bigint | null>(null)

// Search/Filter
const [searchQuery, setSearchQuery] = useState('')
```

### Query State (React Query)
```typescript
// Read Queries (auto-cached)
marketCount = useReadPredictionMarketGetMarketCount()
  → Cached with key: ['getMarketCount']
  → Stale time: 1 minute (default)
  → Refetch on window focus

getMarket(marketId)
  → Cached with key: ['getMarket', marketId]
  → Dependency: marketId parameter

getUserStake(marketId, address)
  → Cached with key: ['getUserStake', marketId, address]
  → Only enabled if userAddress exists
```

### Mutation State (React Query)
```typescript
// Write Mutations
createMarket.mutateAsync(params)
  → onSuccess: invalidate(['markets']) → refetch queries
  → Status: mutation.isPending, mutation.isSuccess, mutation.isError

placeStake.mutateAsync(params)
  → onSuccess: invalidate(['markets', 'stakes']) → bi-directional sync
  → Status: mutation.isPending, mutation.isSuccess

withdrawWinnings.mutateAsync(marketId)
  → onSuccess: invalidate(['stakes']) → update user positions
  → Status: mutation.isPending
```

## Form Validation Architecture

### Validation Layers

**Layer 1: React Hook Form (Client)**
```typescript
register('fieldName', {
  required: 'Field is required',
  pattern: {
    value: /^[0-9]+\.?[0-9]*$/,
    message: 'Invalid number format'
  },
  validate: (value) => {
    // Custom async validation
    return true || 'Error message'
  }
})
```

**Layer 2: Smart Contract (Blockchain)**
```solidity
require(bytes(description).length > 0, "Description required")
require(resolutionBlock > block.number, "Resolution in future")
require(condition > 0 && condition <= 10, "Invalid condition")
```

### Validation Rules by Form

**Create Market**
- description: min 10 chars, max 500 chars
- resolution: 1 ≤ days ≤ 365
- condition: 1 ≤ condition ≤ 10

**Place Stake**
- marketId: 0 ≤ id < marketCount
- amount: > 0 ETH, valid decimal format
- outcome: must be "yes" or "no"

**Withdrawal**
- marketId: must exist and be resolved
- user: must have winning stake
- status: must not already be claimed

## Error Handling Strategy

```typescript
try {
  setStatus('loading')
  const result = await mutation.mutateAsync(data)
  
  setStatus('success')
  setMessage('✅ Operation successful!')
  reset()                           // Clear form
  setTimeout(() => setStatus('idle'), 3000)  // Auto-dismiss
  
} catch (error) {
  setStatus('error')
  
  if (error instanceof Error) {
    if (error.message.includes('insufficient')) {
      setMessage('❌ Insufficient balance')
    } else if (error.message.includes('gas')) {
      setMessage('❌ Gas estimation failed')
    } else {
      setMessage(`❌ Error: ${error.message}`)
    }
  } else {
    setMessage('❌ An unexpected error occurred')
  }
}
```

### Error Scenarios

| Scenario | User Message | Recovery |
|----------|--------------|----------|
| Insufficient ETH balance | "Insufficient balance" | Fund wallet & retry |
| Invalid contract address | "Contract error" | Check config.ts |
| Network error | "Network connection failed" | Retry with fallback |
| Gas too high | "Gas estimation failed" | Reduce amount & retry |
| Market not found | "Invalid market ID" | Check active markets |
| Already claimed | "Winnings already claimed" | View resolved markets |

## Integration Points

### Contract Addresses
```typescript
// config/contracts.ts
export const CONTRACT_ADDRESSES = {
  PredictionMarket: '0x...',  // Must be set
  Token: '0x...',             // Optional (for token stakes)
}
```

### Wagmi Generated Hooks
Required hooks must be generated from ABI:
```typescript
useReadPredictionMarketGetMarket()
useReadPredictionMarketGetUserStake()
useReadPredictionMarketGetMarketCount()
useWritePredictionMarketCreateMarket()
useWritePredictionMarketPlaceStake()
useWritePredictionMarketWithdrawWinnings()
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## Performance Optimizations

### Query Caching
- Markets list: cache for 1 minute (static data)
- User stakes: cache for 30 seconds (user-specific, changes often)
- Market count: cache for 5 minutes (rarely changes)

### Lazy Loading
- Market list: load only visible markets (virtualization ready)
- Resolved markets: paginate or infinite scroll
- My stakes: filter client-side vs server-side based on count

### Memoization
- MarketCards: memo to prevent re-render on parent updates
- StakeForm: memo to prevent form reset on re-render
- StatusCards: memo to prevent animation interruption

## Security Considerations

1. **Contract Validation**
   - All addresses validated before sending transactions
   - Amounts converted to correct decimal places (Wei)

2. **User Verification**
   - User must be connected to wallet
   - Transactions signed by user's private key
   - No sensitive data stored in localStorage

3. **Frontend Validation**
   - Input sanitization before display
   - XSS prevention via React's built-in escaping
   - CSRF protection via wallet signing

## Future Enhancements

- [ ] Real-time WebSocket updates for live market changes
- [ ] Advanced charting for market odds over time
- [ ] API for market history and analytics
- [ ] Multi-token support for different collateral
- [ ] Market resolution dispute mechanism
- [ ] Liquidity pools for market depth
- [ ] API aggregation for external data feeds

