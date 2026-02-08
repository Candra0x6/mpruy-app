# Implementation Summary - React Query Mutations

This document summarizes the React Query mutation implementation for the smart contract hooks.

---

## ✅ Completed Implementation

### 1. **React Query Integration**
- ✅ Installed: `@tanstack/react-query` (already in dependencies)
- ✅ Updated all three hooks with `useMutation` and `useQueryClient`
- ✅ Automatic cache invalidation for relevant queries
- ✅ Built-in loading, success, and error states

### 2. **Updated Hooks**

#### `useGroupPool.ts`
- **Mutations**:
  - `createPool.mutate({ name, multiSig, token })`
  - `depositEth.mutate({ poolId, amount })`
  - `addMember.mutate({ poolId, member })`

#### `useMultiSigWallet.ts`
- **Mutations**:
  - `submitTransaction.mutate({ to, value, data })`
  - `confirmTransaction.mutate(txId)`
  - `executeTransaction.mutate(txId)`
  - `revokeConfirmation.mutate(txId)`

#### `usePredictionMarket.ts`
- **Mutations**:
  - `createMarket.mutate({ description, tokenAddress, resolutionBlock, condition })`
  - `placeStake.mutate({ marketId, outcome, amount, isEth })`
  - `withdrawWinnings.mutate(marketId)`
  - `resolveMarket.mutate({ marketId, outcome })`

### 3. **Key Features**

Each mutation provides:
```typescript
mutation.mutate(params)           // Trigger mutation
mutation.mutateAsync(params)      // Trigger and await
mutation.isPending                // Loading state
mutation.isSuccess                // Success state
mutation.isError                  // Error state
mutation.error                    // Error object
mutation.data                     // Result data
```

### 4. **Automatic Cache Invalidation**

When mutations succeed, related queries are automatically invalidated:

| Hook | Cache Keys Invalidated |
|------|------------------------|
| GroupPool | `['pools']`, `['poolMembers']` |
| MultiSigWallet | `['transactions']` |
| PredictionMarket | `['markets']`, `['stakes']` |

---

## 📝 Documentation

### Available Guides:
1. **[docs/user_flow.md](../docs/user_flow.md)** - High-level user flows for each contract
2. **[docs/react_query_mutations.md](../docs/react_query_mutations.md)** - Detailed mutation usage guide with examples

---

## 🚀 Usage Examples

### Basic Button with Loading State
```tsx
import { usePredictionMarket } from '@/hooks'

export function PlaceStakeButton() {
  const { placeStake } = usePredictionMarket()
  
  return (
    <button 
      onClick={() => placeStake.mutate({
        marketId: BigInt(0),
        outcome: 0,
        amount: BigInt(1000),
        isEth: false
      })}
      disabled={placeStake.isPending}
    >
      {placeStake.isPending ? 'Placing stake...' : 'Place Stake'}
    </button>
  )
}
```

### With Error Display
```tsx
import { usePredictionMarket } from '@/hooks'

export function WithdrawComponent() {
  const { withdrawWinnings } = usePredictionMarket()
  
  return (
    <div>
      <button 
        onClick={() => withdrawWinnings.mutate(BigInt(0))}
        disabled={withdrawWinnings.isPending}
      >
        Withdraw
      </button>
      
      {withdrawWinnings.isError && (
        <p className="text-red-500">
          Error: {withdrawWinnings.error?.message}
        </p>
      )}
      
      {withdrawWinnings.isSuccess && (
        <p className="text-green-500">✓ Withdrawn successfully!</p>
      )}
    </div>
  )
}
```

---

## 🔄 Data Flow

1. **User triggers mutation**: `mutation.mutate(params)`
2. **Wagmi hook executes contract call**
3. **Transaction confirmed**: Callback fires `onSuccess`
4. **Cache invalidation**: `queryClient.invalidateQueries()`
5. **Related queries re-fetch**: UI automatically updates

---

## 📦 Project Structure

```
web/
├── src/
│   ├── hooks/
│   │   ├── useGroupPool.ts          ✅ React Query mutations
│   │   ├── useMultiSigWallet.ts     ✅ React Query mutations
│   │   ├── usePredictionMarket.ts   ✅ React Query mutations
│   │   └── index.ts                 ✅ Central export
│   ├── config/
│   │   └── contracts.ts             ✅ Contract addresses
│   ├── abi/
│   │   ├── generated.ts             ✅ Auto-generated ABIs
│   │   └── index.ts                 ✅ ABI exports
│   └── app/
│       └── providers.tsx             ✅ React Query + Wagmi providers
├── package.json                      ✅ Dependencies included
└── tsconfig.json                     ✅ Path aliases configured
```

---

## ✨ Next Steps

1. **Update Contract Addresses**: [web/src/config/contracts.ts](../web/src/config/contracts.ts)
   ```typescript
   export const CONTRACT_ADDRESSES = {
     GroupPool: '0x...', // Your deployed address
     MultiSigWallet: '0x...',
     PredictionMarket: '0x...',
   }
   ```

2. **Build UI Components**: Use mutations in your React components
   ```tsx
   import { useGroupPool } from '@/hooks'
   ```

3. **Handle Wallet Connection**: Ensure user is connected before transactions
   ```tsx
   const { address } = useAccount()
   // Disable button if !address
   ```

---

## 🧪 Testing Locally

### Start Dev Server:
```bash
npm run dev
```

### Connect to Local Chain:
```bash
cd contracts
anvil  # Starts local blockchain at localhost:8545
```

### Expected Behavior:
- Connect wallet → Select mutations → Trigger transaction → See loading state → See success/error → Cache invalidates → UI updates

---

## 📚 Learning Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## Notes

- React Query is already installed in `package.json`
- All hooks follow the same mutation pattern for consistency
- Cache invalidation is automatic per mutation success
- TypeScript types are fully inferred from contract ABIs
- Error handling is built-in to each mutation
