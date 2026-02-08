# Group Pool UI - Quick Start Guide

## What Was Implemented

A complete frontend implementation for the Group Pool feature based on `useGroupPool.ts` hook and the user flows defined in `user_flow.md`.

### 📁 Files Created

#### Pages
- `web/src/app/group-pool/page.tsx` - Main Group Pool page with tab navigation

#### Components
- `web/src/components/group-pool/pool-dashboard.tsx` - Pool listing & selection
- `web/src/components/group-pool/create-pool-form.tsx` - Create new pools
- `web/src/components/group-pool/deposit-funds-form.tsx` - Deposit ETH/tokens
- `web/src/components/group-pool/manage-members-form.tsx` - Manage pool members
- `web/src/components/group-pool/stake-in-market-form.tsx` - Propose collective bets
- `web/src/components/group-pool/index.ts` - Component exports
- `web/src/components/ui/badge.tsx` - Badge UI component (missing dependency)

#### Documentation
- `docs/GROUP_POOL_UI_IMPLEMENTATION.md` - Comprehensive implementation guide

## ✅ What Each Form Does

### 1. Create Pool Form
```
Creates a new group pool linked to a MultiSigWallet

Inputs:
  - Pool Name (text)
  - MultiSig Address (0x format)
  - Token Address (optional, 0x format)

Action: GroupPool.createPool()
```

### 2. Manage Members Form
```
Add members to the pool

Inputs:
  - Member Wallet Address (0x format)

Actions: 
  - GroupPool.addMember()
  - Displays member count
```

### 3. Deposit Funds Form
```
Members contribute ETH to the pool

Inputs:
  - ETH Amount (decimal)

Actions:
  - GroupPool.depositETH() 
  - Shows pool balance
```

### 4. Stake in Market Form
```
Propose collective bets via MultiSig

Inputs:
  - Market ID (number)
  - Outcome (Yes/No selection)
  - Stake Amount (decimal)

Flow:
  1. Creates MultiSig proposal
  2. Sends to MultiSig owners for confirmation
  3. Once approved, executes PredictionMarket.placeStake()
```

### 5. Pool Dashboard
```
View and manage all pools

Features:
  - List all pools with balance & member count
  - Select pool for other operations
  - Visual status indicators
```

## 🚀 Getting Started

### Step 1: Update Contract Addresses
Edit `web/src/config/contracts.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  GroupPool: '0xYourGroupPoolAddress',
  MultiSigWallet: '0xYourMultiSigAddress', 
  PredictionMarket: '0xYourPredictionMarketAddress',
}
```

### Step 2: Generate Wagmi Hooks
Run your wagmi codegen:
```bash
npm run wagmi  # or your codegen command
```

Ensure it generates hooks for all three contracts.

### Step 3: Add Link to Navigation
Update your main layout to include the Group Pool page:
```tsx
<Link href="/group-pool">Group Pools</Link>
```

### Step 4: Test the Flow

1. **Connect Wallet** - Using wagmi connection
2. **Go to `/group-pool`** - Navigate to the main page
3. **Create Pool** - Tab 1: Initialize a new pool
4. **Add Members** - Tab 2: Add participants  
5. **Deposit Funds** - Tab 3: Contribute ETH
6. **Propose Bet** - Tab 4: Suggest market stake

## 🎨 UI/UX Features

- **Dark Theme** - Slate-based color scheme
- **Form Validation** - Real-time validation with error messages
- **Loading States** - Spinners during transactions
- **Success/Error Alerts** - User feedback for all actions
- **Responsive Design** - Works on mobile and desktop
- **Tab Navigation** - 5 main feature tabs
- **Icon Integration** - Lucide icons for visual clarity
- **Connected Wallet Info** - Display current user address

## 🔗 Data Flow Architecture

```
User Interface
    ↓
React Components (Forms)
    ↓
React Hook Form (Form State)
    ↓
useGroupPool Hook (Wagmi)
    ↓
Smart Contracts (Solidity)
    ↓
Blockchain (Anvil/Testnet/Mainnet)
```

## 📝 Component Dependencies

```
Group Pool Page
├─ Pool Dashboard
│  └─ Card, Badge, Skeleton, Button
├─ Create Pool Form
│  └─ Input, Label, Card
├─ Manage Members Form
│  └─ Input, Label, Card, Button
├─ Deposit Funds Form
│  └─ Input, Label, Card, Tabs, Button
└─ Stake in Market Form
   └─ Input, RadioGroup, Card, Tabs, Button
```

All UI components come from `web/src/components/ui/`

## ⚙️ Integration Points

### With useGroupPool Hook
Each form connects to specific hook methods:

```typescript
// Create Pool
const { createPool } = useGroupPool()
await createPool.mutateAsync({ name, multiSig, token })

// Deposit
const { depositEth } = useGroupPool()
await depositEth.mutateAsync({ poolId, amount })

// Add Member
const { addMember } = useGroupPool()
await addMember.mutateAsync({ poolId, member })

// Get Data
const { getPool, getMemberCount } = useGroupPool()
```

### With Wagmi
- Wallet connection via `useAccount()`
- Query client for cache invalidation
- Contract address configuration

### With React Query
- Mutations for write operations
- Query invalidation on success
- Loading/error states

## 🧪 Testing Recommendations

1. **Test Wallet Connection**
   - Ensure wallet connects before showing forms
   - Show error if not connected

2. **Test Form Validation**
   - Invalid addresses are rejected
   - Amounts > 0 required
   - Pool name min 3 chars

3. **Test Contract Calls**
   - Mock contract responses
   - Test success paths
   - Test error handling

4. **Test Tab Navigation**
   - All tabs accessible
   - Pool selection flows to other tabs
   - Dashboard updates after operations

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `docs/user_flow.md` | Original user flow documentation |
| `docs/GROUP_POOL_UI_IMPLEMENTATION.md` | Detailed implementation guide |
| `web/src/hooks/useGroupPool.ts` | Hook for contract interaction |
| `web/src/app/group-pool/page.tsx` | Main page container |
| `web/src/components/group-pool/*` | Individual form components |
| `web/src/config/contracts.ts` | Contract addresses config |

## 🔧 Troubleshooting

**Q: Pages not loading?**
A: Check if CONTRACT_ADDRESSES are set and networks match

**Q: Form validation always fails?**
A: Verify regex patterns for address (0x + 40 hex chars)

**Q: Wallet not connected?**
A: Ensure wagmi is properly configured in providers

**Q: Hooks not generated?**
A: Run `npm run wagmi` to regenerate from ABIs

## 📦 Dependencies Used

- `react-hook-form` - Form management
- `wagmi` - Wallet & contract interaction
- `viem` - Utils (parseEther, addresses)
- `@tanstack/react-query` - Data fetching
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `class-variance-authority` - Component variants

## 💡 Next Steps

1. Deploy contracts and get addresses
2. Generate wagmi hooks from ABIs
3. Update CONTRACT_ADDRESSES
4. Integrate into main app navigation
5. Add additional features as needed (see docs)

---

**Integration Complete!** The Group Pool UI is ready to use with your smart contracts.
