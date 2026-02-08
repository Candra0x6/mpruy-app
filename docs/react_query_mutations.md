# React Query Mutations Guide - EVM Smart Contract Hooks

This guide explains how to use the React Query mutations integrated into the custom hooks.

---

## Overview

All three hooks (`useGroupPool`, `useMultiSigWallet`, `usePredictionMarket`) now use **React Query v5** mutations for state management, automatic cache invalidation, and better error handling.

### Benefits:
✅ Automatic loading states (`isPending`, `isSuccess`, `isError`)  
✅ Built-in error handling  
✅ Automatic query cache invalidation  
✅ Retry logic for failed requests  
✅ Optimistic updates support  

---

## 1. GroupPool Mutations

### Create Pool
```tsx
import { useGroupPool } from '@/hooks'

export function CreatePoolComponent() {
  const { createPool } = useGroupPool()

  const handleCreate = () => {
    createPool.mutate({
      name: "October Betting Pool",
      multiSig: "0x...",
      token: "0x..." // token address or zero address for ETH
    })
  }

  return (
    <div>
      <button 
        onClick={handleCreate} 
        disabled={createPool.isPending}
      >
        {createPool.isPending ? "Creating..." : "Create Pool"}
      </button>
      {createPool.error && <p>Error: {createPool.error.message}</p>}
      {createPool.isSuccess && <p>Pool created!</p>}
    </div>
  )
}
```

### Deposit ETH
```tsx
import { useGroupPool } from '@/hooks'
import { parseEther } from 'viem'

export function DepositComponent({ poolId }: { poolId: bigint }) {
  const { depositEth } = useGroupPool()

  const handleDeposit = () => {
    depositEth.mutate({
      poolId,
      amount: parseEther('1')
    })
  }

  return (
    <button 
      onClick={handleDeposit}
      disabled={depositEth.isPending}
    >
      {depositEth.isPending ? "Depositing..." : "Deposit 1 ETH"}
    </button>
  )
}
```

### Add Member
```tsx
import { useGroupPool } from '@/hooks'

export function AddMemberComponent({ poolId }: { poolId: bigint }) {
  const { addMember } = useGroupPool()

  const handleAddMember = (memberAddress: `0x${string}`) => {
    addMember.mutate({
      poolId,
      member: memberAddress
    })
  }

  return (
    <>
      {/* Your UI here */}
    </>
  )
}
```

---

## 2. MultiSigWallet Mutations

### Submit Transaction
```tsx
import { useMultiSigWallet } from '@/hooks'
import { encodeFunctionData } from 'viem'

export function SubmitTransactionComponent() {
  const { submitTransaction } = useMultiSigWallet()

  const handleSubmit = (recipient: `0x${string}`, amount: bigint) => {
    submitTransaction.mutate({
      to: recipient,
      value: amount,
      data: '0x' // optional encoded function data
    })
  }

  return (
    <button 
      onClick={() => handleSubmit("0x...", BigInt(1000))}
      disabled={submitTransaction.isPending}
    >
      {submitTransaction.isPending ? "Submitting..." : "Submit Transaction"}
    </button>
  )
}
```

### Confirm Transaction
```tsx
import { useMultiSigWallet } from '@/hooks'

export function ConfirmTransactionComponent({ txId }: { txId: bigint }) {
  const { confirmTransaction } = useMultiSigWallet()

  return (
    <button 
      onClick={() => confirmTransaction.mutate(txId)}
      disabled={confirmTransaction.isPending}
    >
      Confirm
    </button>
  )
}
```

### Execute Transaction
```tsx
import { useMultiSigWallet } from '@/hooks'

export function ExecuteTransactionComponent({ txId }: { txId: bigint }) {
  const { executeTransaction, walletDetails } = useMultiSigWallet()

  const { data: details } = walletDetails

  return (
    <button 
      onClick={() => executeTransaction.mutate(txId)}
      disabled={executeTransaction.isPending || !details}
    >
      Execute
    </button>
  )
}
```

---

## 3. PredictionMarket Mutations

### Create Market
```tsx
import { usePredictionMarket } from '@/hooks'

export function CreateMarketComponent() {
  const { createMarket } = usePredictionMarket()

  const handleCreate = () => {
    createMarket.mutate({
      description: "Will BTC reach $100k by end of month?",
      tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
      resolutionBlock: BigInt(19000000),
      condition: BigInt(50) // gas price threshold
    })
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={createMarket.isPending}
    >
      {createMarket.isPending ? "Creating..." : "Create Market"}
    </button>
  )
}
```

### Place Stake
```tsx
import { usePredictionMarket, PredictionOutcome } from '@/hooks'
import { parseEther } from 'viem'

export function StakeComponent({ marketId }: { marketId: bigint }) {
  const { placeStake } = usePredictionMarket()

  const handleStakeYes = () => {
    placeStake.mutate({
      marketId,
      outcome: PredictionOutcome.Yes,
      amount: parseEther('0.5'),
      isEth: true
    })
  }

  const handleStakeNo = () => {
    placeStake.mutate({
      marketId,
      outcome: PredictionOutcome.No,
      amount: parseEther('0.5'),
      isEth: true
    })
  }

  return (
    <div>
      <button onClick={handleStakeYes} disabled={placeStake.isPending}>
        Bet YES
      </button>
      <button onClick={handleStakeNo} disabled={placeStake.isPending}>
        Bet NO
      </button>
      {placeStake.isSuccess && <p>Stake placed!</p>}
    </div>
  )
}
```

### Withdraw Winnings
```tsx
import { usePredictionMarket } from '@/hooks'

export function WithdrawComponent({ marketId }: { marketId: bigint }) {
  const { withdrawWinnings } = usePredictionMarket()

  return (
    <button 
      onClick={() => withdrawWinnings.mutate(marketId)}
      disabled={withdrawWinnings.isPending}
    >
      {withdrawWinnings.isPending ? "Withdrawing..." : "Claim Winnings"}
    </button>
  )
}
```

### Resolve Market (Admin)
```tsx
import { usePredictionMarket } from '@/hooks'

export function ResolveMarketComponent({ marketId }: { marketId: bigint }) {
  const { resolveMarket } = usePredictionMarket()

  const handleResolveYes = () => {
    resolveMarket.mutate({
      marketId,
      outcome: 0 // Yes
    })
  }

  return (
    <button onClick={handleResolveYes} disabled={resolveMarket.isPending}>
      Resolve as YES
    </button>
  )
}
```

---

## Mutation States Reference

Each mutation has these properties available:

| Property | Type | Description |
| :--- | :--- | :--- |
| `mutate()` | Function | Trigger the mutation |
| `mutateAsync()` | Function | Trigger and await result |
| `isPending` | Boolean | True while mutation is running |
| `isSuccess` | Boolean | True if mutation succeeded |
| `isError` | Boolean | True if mutation failed |
| `error` | Error \| null | Error object if failed |
| `data` | Any | Result from mutation |
| `status` | String | 'idle' \| 'pending' \| 'success' \| 'error' |

---

## Error Handling Example

```tsx
import { useGroupPool } from '@/hooks'

export function SafeTransactionComponent() {
  const { depositEth } = useGroupPool()

  return (
    <div>
      <button 
        onClick={() => depositEth.mutate({ poolId: BigInt(1), amount: BigInt(1000) })}
        disabled={depositEth.isPending}
      >
        Deposit
      </button>

      {depositEth.isPending && <p>Loading...</p>}
      
      {depositEth.isSuccess && (
        <p className="text-green-500">✓ Deposit successful!</p>
      )}
      
      {depositEth.isError && (
        <p className="text-red-500">
          Error: {depositEth.error?.message || "Unknown error"}
        </p>
      )}
    </div>
  )
}
```

---

## Query Cache Invalidation

When a mutation succeeds, it automatically invalidates relevant queries:

- **GroupPool**: Invalidates `['pools']` & `['poolMembers']`
- **MultiSigWallet**: Invalidates `['transactions']`
- **PredictionMarket**: Invalidates `['markets']` & `['stakes']`

This means your UI automatically re-fetches fresh data after each transaction!

---

## Performance Tips

1. **Use `mutateAsync` for sequential operations**:
   ```tsx
   const result = await createPool.mutateAsync(params)
   // Use result immediately
   ```

2. **Combine with useQuery for better flows**:
   ```tsx
   const { data: market } = getMarket(marketId)
   ```

3. **Disable buttons intelligently**:
   ```tsx
   disabled={mutation.isPending || !wallet.isConnected}
   ```
