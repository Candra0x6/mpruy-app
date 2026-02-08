# Prediction Market UI - Quick Start Guide

## Overview

The Prediction Market UI enables users to create binary prediction markets, place stakes on outcomes, and claim winnings. This guide covers setup, features, and integration points.

## Features

### 1. **Dashboard Tab** (`market-dashboard.tsx`)
- **Total Markets Counter**: Displays active market count
- **Market Status**: Shows overall market health
- **Quick Actions**: Navigation buttons to other features
- **How It Works**: Visual walkthrough of market lifecycle
- **Empty States**: Guidance when no markets exist

### 2. **Create Market Tab** (`create-market-form.tsx`)
- **Market Description**: Text area for market question (min 10 chars)
- **Resolution Days**: Set market expiration timeframe (1-365 days)
- **Condition Value**: Define resolution condition number
- **Form Validation**: Inline error messages
- **Success/Error Feedback**: Status cards with messages
- **Market Lifecycle Guide**: Sidebar showing creation → resolution → payout

### 3. **Active Markets Tab** (`active-markets.tsx`)
- **Market List**: Browsable list of active markets
- **Market Selection**: Click to select market for staking
- **Stake Form**: Right sidebar with stake placement
- **Outcome Selection**: YES/NO radio buttons with explanations
- **Amount Input**: ETH amount with validation (parseEther conversion)
- **Status Cards**: Success/error messages for stake placement

### 4. **My Stakes Tab** (`my-stakes.tsx`)
- **Tab Navigation**: All/Pending/Settled filters
- **Stake Cards**: Display individual stakes with details
  - Market ID
  - Stake amount
  - Your prediction outcome
  - Entry date
  - Current status
- **Summary Sidebar**: 
  - Total staked across all markets
  - Win rate percentage calculator
  - Potential winnings display
- **Skeleton Loaders**: Loading states during data fetch

### 5. **Resolved Markets Tab** (`resolved-markets.tsx`)
- **Search Functionality**: Query resolved markets
- **Tab Filters**: All Resolved / Won / Lost
- **Market Cards**: Display resolved outcomes
  - Your stake amount
  - Market result (YES/NO)
  - Your winnings/loss
  - Claim button (if unclaimed)
- **Claim Functionality**: Withdraw winnings button with mutation
- **Payout Information**: Rules and timing display

## Installation & Setup

### Prerequisites
```bash
# Install required dependencies
npm install @tanstack/react-query@5 react-hook-form wagmi@2 viem@2 lucide-react
npx shadcn-ui@latest add tabs card button input label radio-group badge skeleton
```

### Component Integration

1. **Import in Main App**:
```typescript
import { PredictionMarketPage } from '@/app/prediction-market'
```

2. **Add Route** (if using App Router):
```typescript
// app/prediction-market/page.tsx already exists
// Just ensure it's accessible via routing
```

3. **Update Navigation**:
```typescript
// Add link in your main layout
<Link href="/prediction-market">Prediction Market</Link>
```

## Hook Integration Pattern

All components use the `usePredictionMarket()` hook:

```typescript
const { 
  userAddress,
  marketCount,
  getMarket,
  getUserStake,
  createMarket,
  placeStake,
  withdrawWinnings,
  resolveMarket
} = usePredictionMarket()
```

### Query Methods
- `marketCount` - Get total markets (useQuery)
- `getMarket(marketId)` - Get specific market details
- `getUserStake(marketId, address?)` - Get user's stake info

### Mutation Methods
- `createMarket.mutateAsync({description, tokenAddress, resolutionBlock, condition})`
- `placeStake.mutateAsync({marketId, outcome, amount, isEth})`
- `withdrawWinnings.mutateAsync(marketId)`
- `resolveMarket.mutateAsync({marketId, outcome})` - Admin only

## Form Data Structures

### Create Market Form
```typescript
interface CreateMarketFormData {
  description: string     // "Will Bitcoin reach $100k?"
  resolution: string      // "30" (days)
  condition: string       // "1" (resolution condition)
}
```

### Place Stake Form
```typescript
interface StakeFormData {
  marketId: string        // "0", "1", "2", etc.
  amount: string          // "0.5" (ETH, converted with parseEther)
  outcome: string         // "yes" or "no"
}
```

## Key Code Patterns

### Form Submission with React Hook Form
```typescript
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

const onSubmit = async (data) => {
  try {
    setStatus('loading')
    await mutation.mutateAsync(convertedData)
    setStatus('success')
    reset()
    setTimeout(() => setStatus('idle'), 3000)
  } catch (error) {
    setStatus('error')
  }
}
```

### Amount Conversion
```typescript
import { parseEther } from 'viem'
const amountInWei = parseEther(data.amount)  // "0.5" → 500000000000000000n
```

### Status Feedback Pattern
```typescript
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [message, setMessage] = useState('')

{status === 'success' && (
  <Card className="border-green-500/50 bg-green-950/20 p-4">
    <CheckCircle size={18} /> {message}
  </Card>
)}
```

## Styling & Theme

All components follow the established dark theme:
- **Background**: `bg-slate-950`, `bg-slate-900`, `bg-slate-800`
- **Text**: `text-white`, `text-slate-300`, `text-slate-400`
- **Borders**: `border-slate-700`, `border-slate-600`
- **Accents**: 
  - Blue: `#3b82f6` (`bg-blue-600`, `text-blue-300`)
  - Green: `#16a34a` (`bg-green-600`, `text-green-300`)
  - Red: `#dc2626` (`bg-red-600`, `text-red-300`)
  - Purple: `#a855f7` (`text-purple-400`)

## API Integration Points

### Contract Method Calls
```typescript
// Create market
createMarket.mutateAsync({
  description: "Will Bitcoin reach $100k by EOY?",
  tokenAddress: CONTRACT_ADDRESSES.Token,
  resolutionBlock: futureBlockNumber,
  condition: 1
})

// Place stake
placeStake.mutateAsync({
  marketId: BigInt(0),
  outcome: PredictionOutcome.Yes,  // 0 for YES, 1 for NO
  amount: parseEther("0.5"),
  isEth: true
})

// Claim winnings
withdrawWinnings.mutateAsync(BigInt(0))
```

## Testing Checklist

### Dashboard Tests
- [ ] Market count displays correctly
- [ ] Status badge shows "Active"
- [ ] Quick start buttons are clickable
- [ ] Empty state message appears when count = 0

### Create Market Tests
- [ ] Form validates description (min 10 chars)
- [ ] Form validates resolution (1-365 days)
- [ ] Form validates condition (1-10)
- [ ] Success message appears after submission
- [ ] Form resets after successful submission
- [ ] Error message displays on failure

### Active Markets Tests
- [ ] Market list shows all available markets
- [ ] Click market to select (visual highlight)
- [ ] Amount input validates (> 0)
- [ ] YES/NO radio buttons toggle
- [ ] Form validates all inputs
- [ ] Stake submission updates status cards

### My Stakes Tests
- [ ] All stakes tab shows all stakes
- [ ] Pending tab filters correctly
- [ ] Settled tab filters correctly
- [ ] Summary stats display correctly
- [ ] Loading skeletons appear during fetch

### Resolved Markets Tests
- [ ] Resolved markets display with outcomes
- [ ] Search filters markets
- [ ] Won/Lost tabs filter correctly
- [ ] Claim button appears for unclaimed winnings
- [ ] Withdrawal updates status cards

## Troubleshooting

### Issue: Form validation not working
**Solution**: Ensure react-hook-form is properly installed and Input/Button components accept `{...register()}` props

### Issue: Amount conversion errors
**Solution**: Use `parseEther()` from viem for ETH conversion, not manual calculation

### Issue: Skeleton loaders not appearing
**Solution**: Check that `marketCount.isLoading` is correctly passed to conditional render

### Issue: Status messages don't disappear
**Solution**: Verify `setTimeout(() => setStatus('idle'), 3000)` is called after success

## File Structure

```
web/src/
├── app/
│   └── prediction-market/
│       └── page.tsx                 # Main page container (5 tabs)
├── components/
│   └── prediction-market/
│       ├── market-dashboard.tsx     # Dashboard component (85 lines)
│       ├── create-market-form.tsx   # Create form (145 lines)
│       ├── active-markets.tsx       # Browse & stake (210 lines)
│       ├── my-stakes.tsx            # User stakes (165 lines)
│       ├── resolved-markets.tsx     # Resolved outcomes (175 lines)
│       └── index.ts                 # Component exports
└── hooks/
    └── usePredictionMarket.ts       # Hook provided (uses wagmi)
```

## Next Steps

1. **Configure Contract Address**:
   - Update `web/src/config/contracts.ts` with PredictionMarket address

2. **Generate Wagmi Hooks**:
   - Run `npm run wagmi` to auto-generate contract hooks from ABI

3. **Add Navigation**:
   - Link `/prediction-market` in main app navigation

4. **Test Integration**:
   - Verify contracts are responding to mutations
   - Check gas usage and network fees

5. **Deploy**:
   - Build: `npm run build`
   - Deploy to production hosting
   - Monitor error logs

## Resources

- [Wagmi Docs](https://wagmi.sh)
- [React Hook Form Docs](https://react-hook-form.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Viem Documentation](https://viem.sh)

