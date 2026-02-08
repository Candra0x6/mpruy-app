# MultiSig Wallet UI - Architecture & Technical Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              MULTISIG WALLET FRONTEND (React)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /multi-sig (Main Page)                                      │
│  │                                                            │
│  ├─ Dashboard Tab ──────────────> WalletDashboard            │
│  │  └─ Wallet Balance                                        │
│  │  └─ Required Confirmations                                │
│  │  └─ Owner List                                            │
│  │                                                            │
│  ├─ Submit TX Tab ──────────────> SubmitTransactionForm      │
│  │  ├─ ETH Transfer Mode                                     │
│  │  │  └─ Recipient + Amount                                 │
│  │  └─ Contract Call Mode                                    │
│  │     └─ Contract + Encoded Data                            │
│  │                                                            │
│  ├─ Pending Tab ────────────────> PendingTransactions        │
│  │  ├─ List of unsigned TXs                                  │
│  │  ├─ Confirmation progress                                 │
│  │  ├─ Confirm button                                        │
│  │  └─ Execute button (when ready)                           │
│  │                                                            │
│  ├─ History Tab ────────────────> TransactionHistory         │
│  │  ├─ Executed transactions                                 │
│  │  ├─ Failed transactions                                   │
│  │  └─ Search & filter                                       │
│  │                                                            │
│  └─ Owners Tab ─────────────────> ManageOwners               │
│     ├─ All owners list                                       │
│     ├─ Current user role                                     │
│     └─ Permissions info                                      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useMultiSigWallet Hook                                      │
│  ├─ Queries (walletDetails, owners, getTransaction)         │
│  └─ Mutations (submit/confirm/execute/revoke)               │
│                                                               │
│  React Hook Form - Form State Management                     │
│  React Query - Data Caching & Invalidation                   │
│  Wagmi - Wallet & Contract Interaction                       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    BLOCKCHAIN LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  MultiSigWallet Smart Contract                              │
│  ├─ submitTransaction(to, value, data)                      │
│  ├─ confirmTransaction(txId)                                │
│  ├─ executeTransaction(txId)                                │
│  ├─ revokeConfirmation(txId)                                │
│  ├─ getWalletDetails()                                      │
│  ├─ getTransaction(txId)                                    │
│  └─ getOwners()                                             │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│              BLOCKCHAIN (EVM)                                 │
├─────────────────────────────────────────────────────────────┤
│        (Anvil / Sepolia / Mainnet)                           │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Flow 1: Submit ETH Transfer Transaction
```
User fills SubmitTransactionForm (ETH mode)
        ↓
Validates inputs:
  - Address format ✓
  - Amount > 0 ✓
  - Description (optional)
        ↓
User clicks "Propose ETH Transfer"
        ↓
Form converts amount to wei:
  parseFloat(amount) * 1e18 = BigInt
        ↓
useMultiSigWallet.submitTransaction({
  to: "0x...",
  value: BigInt(amount),
  data: "0x"  // Empty for ETH
})
        ↓
Contract call:
  MultiSigWallet.submitTransaction(to, value, 0x)
        ↓
Success event emitted with txId
        ↓
React Query invalidates ['transactions']
        ↓
PendingTransactions component refreshes
        ↓
New TX appears in the pending list
```

### Flow 2: Submit Contract Call Transaction
```
User fills SubmitTransactionForm (Contract mode)
        ↓
Validates inputs:
  - Contract address format ✓
  - Function data format (0x...) ✓
  - Optional amount
        ↓
User clicks "Propose Contract Call"
        ↓
useMultiSigWallet.submitTransaction({
  to: "0xContractAddress",
  value: BigInt(0) or BigInt(amount),
  data: "0x..." // Encoded function call
})
        ↓
Contract call:
  MultiSigWallet.submitTransaction(to, value, data)
        ↓
Success: TX ID returned
        ↓
Query cache invalidated
        ↓
Transaction appears in Pending list
```

### Flow 3: Confirm & Execute Transaction
```
Step 1: View Pending TX
Owner navigates to Pending tab
        ↓
Gets list from: MultiSigWallet.getTransaction(txId)
        ↓
Shows confirmation progress (e.g., 2/3)
        ↓

Step 2: Owner A Confirms
Owner clicks "Confirm" button
        ↓
Calls confirmTransaction.mutateAsync(txId)
        ↓
Contract: MultiSigWallet.confirmTransaction(txId)
        ↓
Confirmation recorded
        ↓
confirmations: 1 → 2
        ↓
Query refreshes, UI updates
        ↓

Step 3: Owner B Confirms
Same process:
  confirmTransaction(txId)
        ↓
Confirmation count: 2 → 3
        ↓
Threshold reached (3 required, 3 confirmed)
        ↓
UI: "Ready" badge shows
UI: "Execute" button appears
        ↓

Step 4: Execute
Owner C (or any owner) clicks "Execute"
        ↓
Calls executeTransaction.mutateAsync(txId)
        ↓
Contract: MultiSigWallet.executeTransaction(txId)
        ↓
Smart contract executes pending action:
  - If ETH transfer: sends to recipient
  - If contract call: executes with data
        ↓
Transaction marked as "executed"
        ↓
Query invalidated
        ↓
TX moves to History tab
```

### Flow 4: Revoke Confirmation (Optional)
```
Owner who previously confirmed changes mind
        ↓
Clicks "Revoke" button (if available)
        ↓
Calls revokeConfirmation.mutateAsync(txId)
        ↓
Contract: MultiSigWallet.revokeConfirmation(txId)
        ↓
Owner's confirmation removed
        ↓
Confirmations: 3 → 2
        ↓
If below threshold:
  "Execute" button disappears
  Status: "Pending" again
        ↓
Other owners need to re-confirm
```

## Component Hierarchy

```
MultiSigWalletPage (Main Container)
│
├─ Header
│  ├─ Title
│  ├─ Subtitle
│  └─ Connected Address
│
├─ TabsContainer
│  │
│  ├─ Tab: Dashboard
│  │  └─ WalletDashboard
│  │     ├─ MetricCards (3)
│  │     │  ├─ Balance Card
│  │     │  ├─ Confirmations Card
│  │     │  └─ Owners Count Card
│  │     ├─ WalletDetailsCard
│  │     └─ OwnersListCard
│  │        └─ OwnerItem (for each owner)
│  │
│  ├─ Tab: Submit TX
│  │  └─ SubmitTransactionForm
│  │     ├─ TabsContainer (ETH/Contract)
│  │     │  ├─ ETHTab
│  │     │  │  ├─ RecipientInput
│  │     │  │  ├─ AmountInput
│  │     │  │  ├─ DescriptionInput
│  │     │  │  ├─ InfoBox
│  │     │  │  └─ SubmitButton
│  │     │  │
│  │     │  └─ ContractTab
│  │     │     ├─ ContractAddressInput
│  │     │     ├─ FunctionDataInput
│  │     │     ├─ ValueInput (optional)
│  │     │     ├─ DescriptionInput
│  │     │     ├─ InfoBox
│  │     │     └─ SubmitButton
│  │     └─ StatusMessages
│  │
│  ├─ Tab: Pending TXs
│  │  └─ PendingTransactions
│  │     ├─ TransactionList
│  │     │  └─ TransactionItem (for each)
│  │     │     ├─ Address Display
│  │     │     ├─ Status Badge
│  │     │     ├─ Value Display
│  │     │     ├─ ConfirmationProgressBar
│  │     │     ├─ ConfirmButton
│  │     │     └─ ExecuteButton (conditional)
│  │     ├─ InfoBox
│  │     └─ EmptyState (if none)
│  │
│  ├─ Tab: History
│  │  └─ TransactionHistory
│  │     ├─ SearchBar
│  │     ├─ TabsContainer (All/Executed/Failed)
│  │     │  └─ TransactionList
│  │     │     └─ TransactionItem (for each)
│  │     │        ├─ Address Display
│  │     │        ├─ Status Badge
│  │     │        └─ Timestamp
│  │     └─ EmptyState (if none)
│  │
│  └─ Tab: Owners
│     └─ ManageOwners
│        ├─ StatisticCards (2)
│        │  ├─ Total Owners
│        │  └─ User Role
│        ├─ OwnersListCard
│        │  └─ OwnerItem (for each)
│        │     ├─ Number Badge
│        │     ├─ Address
│        │     └─ Status Badge
│        ├─ GovernanceDetailsCard
│        │  ├─ ConfirmationThreshold
│        │  ├─ TransactionTypes
│        │  └─ ExecutionProcess
│        ├─ PermissionsCard
│        └─ NotesCard (if non-owner)
```

## State Management

### Local Component States

```
SubmitTransactionForm:
  - status: 'idle' | 'loading' | 'success' | 'error'
  - message: string
  - txMode: 'eth' | 'contract'
  - form state: { targetAddress, amount, data, description }

PendingTransactions:
  - actionStatus: 'idle' | 'loading' | 'confirming' | 'executing'
  - selectedAction: bigint | null
  - selectedTxId: bigint | null

TransactionHistory:
  - searchTerm: string
  - activeTab: 'all' | 'executed' | 'failed'

ManageOwners:
  - ownersList: 0x${string}[]
  - isLoading: boolean
```

### Global State (via Hooks)

```
useMultiSigWallet:
  - walletDetails: Query
  - owners: Query
  - getTransaction: (txId) => Query
  - submitTransaction: Mutation
  - confirmTransaction: Mutation
  - executeTransaction: Mutation
  - revokeConfirmation: Mutation

useAccount (wagmi):
  - address: 0x${string} | undefined
  - isConnected: boolean
```

### React Query Cache Keys

```
Query Keys:
  - ['walletDetails']
  - ['owners']
  - ['transaction', txId]
  - ['transactions']

Invalidation Triggers:
  - On submitTransaction success → invalidate ['transactions']
  - On confirmTransaction success → invalidate ['transaction', txId]
  - On executeTransaction success → invalidate ['transactions']
  - On revokeConfirmation success → invalidate ['transaction', txId]
```

## Security Model

### Owner Verification
- Only owners can submit, confirm, execute
- Hook checks `userAddress` against owners list
- Non-owners see read-only views

### Transaction Validation
```
Address Validation: /^0x[a-fA-F0-9]{40}$/
Amount Validation: > 0 (decimal)
Data Validation: /^0x[a-fA-F0-9]*$/ (hex)
```

### Confirmation Threshold
- Contract enforces M-of-N signature scheme
- UI shows progress toward threshold
- Execute blocked until threshold met

### Type Safety
- TypeScript for all components
- Viem for safe amount handling
- Wagmi generated types from ABIs

## Error Handling

### Submission Errors
```
Form Validation
  ↓ (if invalid)
Show inline error message
  ↓ (user corrects)
Enable submit
  ↓

Contract Call Error
  ↓
Catch exception
  ↓
Set error status
  ↓
Display error card
  ↓
Allow user to retry
```

### UI Feedback
- Red error cards with icon
- Green success cards with confirmation
- Yellow/Orange warning cards
- Loading spinners on buttons
- Disabled state while processing

## Performance Optimizations

1. **Lazy Loading**
   - Skeleton loaders while fetching
   - Conditional rendering of tabs

2. **Query Caching**
   - React Query caches owner list
   - Wallet details cached
   - Smart invalidation on updates

3. **Memoization**
   - useCallback for event handlers
   - useMemo for derived states
   - Prevent unnecessary re-renders

## Integration Points

### With Smart Contract
- Direct calls via generated wagmi hooks
- Event listening (future enhancement)
- Error handling from contract failures

### With Wallet
- Connection via wagmi useAccount
- Network detection
- Gas estimation

### With User
- Form inputs
- Button clicks
- Tab navigation
- Search filters

## Deployment Considerations

### Network Configuration
- Set correct RPC endpoint
- Verify contract addresses match network
- Test on testnet first

### Gas Estimation
- Contract calls gas fees
- User wallet balance check
- Failed transaction handling

### Monitoring
- Error logging
- Transaction tracking
- User analytics

---

## Complete Implementation Checklist

- [x] Page layout with 5 tabs
- [x] Wallet dashboard
- [x] Transaction submission (ETH & Contract)
- [x] Pending transactions with confirmations
- [x] Transaction history view
- [x] Owner management display
- [x] Form validation
- [x] Error handling
- [x] Loading states
- [x] Responsive design
- [x] Dark theme
- [x] Type safety
- [x] Documentation

**Status: ✅ PRODUCTION READY**
