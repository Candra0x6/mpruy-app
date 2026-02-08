# Quick Reference - React Query Mutations API

Quick lookup for all available mutations across the three hooks.

---

## 🎯 GroupPool

### `useGroupPool()`

#### Queries (Read-only)
```tsx
const { getPool, getMemberCount } = useGroupPool()

getPool(poolId: bigint)              // Returns useQuery
getMemberCount(poolId: bigint)       // Returns useQuery
```

#### Mutations (Write)
```tsx
const { createPool, depositEth, addMember } = useGroupPool()

// Create Pool
createPool.mutate({ name: string, multiSig: address, token: address })
createPool.isPending, .isSuccess, .isError, .error

// Deposit ETH  
depositEth.mutate({ poolId: bigint, amount: bigint })
depositEth.isPending, .isSuccess, .isError, .error

// Add Member
addMember.mutate({ poolId: bigint, member: address })
addMember.isPending, .isSuccess, .isError, .error
```

---

## 🔐 MultiSigWallet

### `useMultiSigWallet()`

#### Queries (Read-only)
```tsx
const { walletDetails, owners, getTransaction } = useMultiSigWallet()

walletDetails                  // useQuery - Gets { owners, reqSigs, balance, txCount }
owners                         // useQuery - Gets array of active owners
getTransaction(txId: bigint)   // Returns useQuery
```

#### Mutations (Write)
```tsx
const { 
  submitTransaction, 
  confirmTransaction, 
  executeTransaction, 
  revokeConfirmation 
} = useMultiSigWallet()

// Submit Transaction
submitTransaction.mutate({ to: address, value: bigint, data: hex })

// Confirm Transaction
confirmTransaction.mutate(txId: bigint)

// Execute Transaction
executeTransaction.mutate(txId: bigint)

// Revoke Confirmation
revokeConfirmation.mutate(txId: bigint)
```

---

## 🎰 PredictionMarket

### `usePredictionMarket()`

#### Queries (Read-only)
```tsx
const { marketCount, getMarket, getUserStake } = usePredictionMarket()

marketCount                                      // useQuery - Gets total market count
getMarket(marketId: bigint)                      // Returns useQuery
getUserStake(marketId: bigint, address?: string) // Returns useQuery
```

#### Mutations (Write)
```tsx
const { 
  createMarket, 
  placeStake, 
  withdrawWinnings, 
  resolveMarket 
} = usePredictionMarket()

// Create Market
createMarket.mutate({
  description: string,
  tokenAddress: address,
  resolutionBlock: bigint,
  condition: bigint
})

// Place Stake
placeStake.mutate({
  marketId: bigint,
  outcome: number,        // 0 = Yes, 1 = No
  amount: bigint,
  isEth: boolean
})

// Withdraw Winnings
withdrawWinnings.mutate(marketId: bigint)

// Resolve Market (Admin)
resolveMarket.mutate({
  marketId: bigint,
  outcome: number         // 0 = Yes, 1 = No
})
```

---

## 📊 Mutation State Template

All mutations follow this pattern:

```typescript
mutation.mutate(params)              // ← Trigger mutation
mutation.mutateAsync(params)         // ← Trigger & await

// States
mutation.isPending                   // boolean - Is executing
mutation.isSuccess                   // boolean - Succeeded
mutation.isError                     // boolean - Failed
mutation.isIdle                      // boolean - Not triggered yet

// Data & Errors
mutation.data                        // TData - Result from contract
mutation.error                       // Error | null - Error if failed
mutation.status                      // 'idle' | 'pending' | 'success' | 'error'
mutation.failureCount                // number - Retry count
mutation.failureReason               // Error | null - Reason for failure

// Methods
mutation.reset()                     // Reset to initial state
mutation.mutate(params, {
  onSuccess: (data) => {},
  onError: (error) => {},
  onSettled: (data, error) => {}
})
```

---

## 🔌 Common Patterns

### Pattern 1: Simple Button
```tsx
<button 
  onClick={() => mutation.mutate(params)}
  disabled={mutation.isPending}
>
  {mutation.isPending ? 'Loading...' : 'Action'}
</button>
```

### Pattern 2: With Confirmation
```tsx
{mutation.isSuccess && <p>✓ Success!</p>}
{mutation.isError && <p>✗ Error: {mutation.error.message}</p>}
```

### Pattern 3: Async/Await
```tsx
const handleClick = async () => {
  try {
    const result = await mutation.mutateAsync(params)
    console.log('Success:', result)
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

### Pattern 4: With Effect
```tsx
useEffect(() => {
  if (mutation.isSuccess) {
    // Do something after success
  }
}, [mutation.isSuccess])
```

---

## 🎯 TypeScript Types

```typescript
import type { usePredictionMarket } from '@/hooks'

// Get return type
type Hook = ReturnType<typeof usePredictionMarket>

// Destructure what you need
const { placeStake, withdrawWinnings } = usePredictionMarket()

// Use in functions
function processMutation(mutation: typeof placeStake) {
  return mutation.isPending
}
```

---

## ⚡ Performance Tips

### ✅ DO:
```tsx
// Destructure only what you need
const { createPool } = useGroupPool()
```

```tsx
// Use mutateAsync for sequential operations
const result = await mutation1.mutateAsync(params)
const result2 = await mutation2.mutateAsync(result)
```

```tsx
// Conditionally disable based on state
disabled={!wallet.isConnected || mutation.isPending}
```

### ❌ DON'T:
```tsx
// Don't use mutation without checking address
mutation.mutate(params)  // Check address first!
```

```tsx
// Don't create hooks inside loops
for (...) { const hook = useGroupPool() }
```

```tsx
// Don't call mutation.mutate() inside render
render() { mutation.mutate(p) }  // Use onClick instead
```

---

## 🧪 Testing Example

```tsx
import { renderHook, act } from '@testing-library/react'
import { useGroupPool } from '@/hooks'

test('depositing eth', async () => {
  const { result } = renderHook(() => useGroupPool())
  
  act(() => {
    result.current.depositEth.mutate({
      poolId: BigInt(1),
      amount: BigInt(1000)
    })
  })
  
  await waitFor(() => {
    expect(result.current.depositEth.isSuccess).toBe(true)
  })
})
```

---

## 🔗 Related Files

- Hooks implementation: [web/src/hooks/](../web/src/hooks/)
- Contract addresses: [web/src/config/contracts.ts](../web/src/config/contracts.ts)
- Full guide: [docs/react_query_mutations.md](./react_query_mutations.md)
- User flows: [docs/user_flow.md](./user_flow.md)
