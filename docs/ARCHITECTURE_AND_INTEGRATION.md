# Group Pool UI - Architecture & Integration Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /group-pool                                                 │
│  └─ Main Page (Tabs Navigation)                             │
│     ├─ Dashboard Tab ──────────────> PoolDashboard           │
│     ├─ Create Pool Tab ────────────> CreatePoolForm          │
│     ├─ Members Tab ────────────────> ManageMembersForm       │
│     ├─ Deposit Tab ────────────────> DepositFundsForm        │
│     └─ Stake Tab ─────────────────> StakeInMarketForm        │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                     APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useGroupPool Hook                                           │
│  ├─ Read Operations (getPool, getMemberCount)               │
│  └─ Write Operations (createPool, depositEth, addMember)     │
│                                                               │
│  Form State Management (React Hook Form)                     │
│  Caching & Queries (@tanstack/react-query)                  │
│  Wallet Connection (wagmi)                                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                     CONTRACT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐ ┌─────────────────┐ ┌──────────────────┐│
│  │  GroupPool     │ │ MultiSigWallet  │ │PredictionMarket  ││
│  │  Contract      │ │   Contract      │ │   Contract       ││
│  │                │ │                 │ │                  ││
│  │ • createPool() │ │ • submitTx()    │ │ • createMarket() ││
│  │ • depositETH() │ │ • confirmTx()   │ │ • placeStake()   ││
│  │ • addMember()  │ │ • executeTx()   │ │ • resolve()      ││
│  │ • stakeInMkt() │ │ • revoke()      │ │ • withdraw()     ││
│  └────────────────┘ └─────────────────┘ └──────────────────┘│
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    BLOCKCHAIN (EVM)                           │
├─────────────────────────────────────────────────────────────┤
│  (Anvil / Sepolia / Mainnet)                                │
└─────────────────────────────────────────────────────────────┘
```

## User Flow Implementation

### Flow 1: Pool Creation
```
User fills CreatePoolForm
        ↓
Form validates input (name, multiSig, token)
        ↓
"Create Pool" button clicked
        ↓
useGroupPool.createPool.mutateAsync()
        ↓
GroupPool.createPool() executed on blockchain
        ↓
Success event received
        ↓
Query cache invalidated
        ↓
PoolDashboard refreshes (shows new pool)
```

### Flow 2: Member Management
```
Dashboard: Select Pool
        ↓
Navigate to Members tab
        ↓
Current memberCount loaded from contract
        ↓
User fills address input
        ↓
"Add Member" clicked
        ↓
useGroupPool.addMember.mutateAsync()
        ↓
GroupPool.addMember() executed
        ↓
Member count refreshed
        ↓
UI shows success message
```

### Flow 3: Deposit Funds
```
Dashboard: Select Pool
        ↓
Navigate to Deposit tab
        ↓
Pool balance shown: getPool(poolId)
        ↓
User enters ETH amount
        ↓
"Deposit ETH" clicked
        ↓
useGroupPool.depositEth.mutateAsync()
        ↓
GroupPool.depositETH() executed with amount as value
        ↓
Pool balance updated
        ↓
UI confirms deposit
```

### Flow 4: Collective Betting (MultiSig Governed)
```
Dashboard: Select Pool
        ↓
Navigate to Stake tab
        ↓
User enters:
  - Market ID
  - Outcome (Yes/No)
  - Stake Amount
        ↓
"Submit Stake Proposal" clicked
        ↓
Creates MultiSigWallet.submitTransaction()
  args: [target=PredictionMarket, method=placeStake()]
        ↓
Proposal sent to MultiSig owners
        ↓
Owners see proposal in their MultiSig UI
        ↓
Each owner calls MultiSigWallet.confirmTransaction()
        ↓
Once threshold reached, any owner calls executeTransaction()
        ↓
PredictionMarket.placeStake() executed
        ↓
Pool's funds now in prediction market
```

### Flow 5: Winnings Distribution
```
Prediction Market resolves
        ↓
Pool's stake resolves to winnings
        ↓
GroupPool.claimAndDistributeWinnings()
        ↓
Calculates each member's share based on deposit ratio
        ↓
Distributions sent back to members
        ↓
UI shows claim confirmation
```

## Component Hierarchy

```
GroupPoolPage (Main Container)
│
├─ Header
│  ├─ Title
│  ├─ Description
│  └─ Connected Wallet Display
│
├─ TabsContainer
│  │
│  ├─ Tab: Dashboard
│  │  └─ PoolDashboard
│  │     └─ PoolCard (for each pool)
│  │        ├─ Pool Name
│  │        ├─ Member Count
│  │        ├─ Balance Display
│  │        └─ Select Button
│  │
│  ├─ Tab: Create Pool
│  │  └─ CreatePoolForm
│  │     ├─ NameInput
│  │     ├─ MultiSigAddressInput
│  │     ├─ TokenAddressInput (optional)
│  │     ├─ ValidationMessages
│  │     └─ SubmitButton
│  │
│  ├─ Tab: Members
│  │  └─ ManageMembersForm
│  │     ├─ MemberStats (count display)
│  │     ├─ AddMemberForm
│  │     │  ├─ AddressInput
│  │     │  └─ SubmitButton
│  │     └─ Guidelines
│  │
│  ├─ Tab: Deposit
│  │  └─ DepositFundsForm
│  │     ├─ PoolInfo
│  │     ├─ TabsContainer (ETH / Token)
│  │     │  ├─ ETHTab
│  │     │  │  ├─ AmountInput
│  │     │  │  ├─ MaxButton
│  │     │  │  └─ SubmitButton
│  │     │  └─ TokenTab (disabled)
│  │     └─ StatusMessages
│  │
│  └─ Tab: Stake
│     └─ StakeInMarketForm
│        ├─ TabsContainer (Propose / History)
│        │  ├─ ProposeTab
│        │  │  ├─ MarketIDInput
│        │  │  ├─ OutcomeRadios
│        │  │  ├─ StakeAmountInput
│        │  │  ├─ FlowExplanation
│        │  │  └─ SubmitButton
│        │  └─ HistoryTab (empty state)
│        └─ ImportanceWarning
│
└─ DisconnectAlert (if wallet drops)
```

## State Management

### Local State (per component)
```
CreatePoolForm
  - status: 'idle' | 'loading' | 'success' | 'error'
  - message: string
  - form data: { poolName, multiSigAddress, tokenAddress }

DepositFundsForm
  - status: 'idle' | 'loading' | 'success' | 'error'
  - depositType: 'eth' | 'token'
  - poolData: PoolInfo

ManageMembersForm
  - status: 'idle' | 'loading' | 'success' | 'error'
  - memberCount: number
```

### Global State (via hooks)
```
useGroupPool hook manages:
  - Pool queries (useQuery)
  - Write mutations (useMutation)
  - Query client invalidation

useAccount hook provides:
  - Connected address
  - Connection status
```

### React Query Cache
```
invalidateQueries keys:
  - ['pools'] - after createPool, depositEth
  - ['poolMembers'] - after addMember
  - [poolId] - after getPool
```

## Error Handling

```
Each form handles:

1. Pre-submission validation
   ├─ Address format (0x + 40 hex)
   ├─ Required fields
   ├─ Numeric validation
   └─ Min/Max constraints

2. Submission errors
   ├─ Contract errors
   ├─ Network errors
   ├─ Wallet rejection
   └─ Transaction failures

3. User feedback
   ├─ Success alerts
   ├─ Error messages
   ├─ Loading states
   └─ Status badges
```

## Security Considerations

1. **Address Validation**
   - All addresses validated with regex (0x format)
   - Prevents invalid contract calls

2. **Amount Validation**
   - Must be > 0 (parseEther handles decimals)
   - Prevents spam or zero-value transactions

3. **MultiSig Governance**
   - Staking requires MultiSig approval
   - Prevents unauthorized betting
   - Requires threshold confirmations

4. **Type Safety**
   - TypeScript with strict types
   - Viem for safe amount handling
   - Wagmi generated types from ABIs

## Integration Checklist

- [ ] Deploy GroupPool contract
- [ ] Deploy MultiSigWallet contract
- [ ] Deploy PredictionMarket contract
- [ ] Set CONTRACT_ADDRESSES in config
- [ ] Generate wagmi hooks from ABIs
- [ ] Install all dependencies
- [ ] Test wallet connection
- [ ] Test form validation
- [ ] Test contract calls (testnet)
- [ ] Review security
- [ ] Deploy to production
- [ ] Add monitoring/analytics

## Performance Considerations

1. **Rendering**
   - Lazy load pool list (pagination ready)
   - Memoize expensive renders
   - Skeleton loaders for data

2. **Data Fetching**
   - React Query caching
   - Smart invalidation strategies
   - Only fetch necessary data

3. **Network**
   - Batch requests where possible
   - Handle slow networks gracefully
   - Retry failed requests

## Debugging Guide

### Enable Wagmi Logging
```tsx
import { createConfig } from 'wagmi'

export const config = createConfig({
  // ... config
  logger: {
    warn: (message) => console.warn(message),
  },
})
```

### React Query DevTools
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// In App
<ReactQueryDevtools initialIsOpen={false} />
```

### Contract Interactions
- Check in browser DevTools Network tab
- Look for failed contract calls
- Verify gas estimates
- Check wallet balance

## Related Documentation

- [User Flow](./user_flow.md) - Overall system design
- [Smart Contract TODO](./smart_contract_todo.md) - Contract status
- [Backend/Frontend TODO](./backend_frontend_todo.md) - Project tasks
- [Implementation Summary](./implementation_summary.md) - Overall progress
