'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePredictionMarket, PredictionOutcome } from '@/hooks/usePredictionMarket'
import { useAccount } from 'wagmi'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle, Loader2, TrendingUp, Search, Info } from 'lucide-react'
import { parseEther } from 'viem'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion, AnimatePresence } from 'framer-motion'

interface ActiveMarketsProps {
  selectedMarketId: bigint | null
}

interface StakeFormData {
  marketId: string
  amount: string
  outcome: string
}

export function ActiveMarkets({ selectedMarketId }: ActiveMarketsProps) {
  const { marketCount, placeStake } = usePredictionMarket()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<StakeFormData>({
    defaultValues: {
      marketId: selectedMarketId?.toString() || '0',
      amount: '',
      outcome: 'yes',
    },
  })

  const watchMarketId = watch('marketId')
  const watchOutcome = watch('outcome')
  const count = marketCount.data ? Number(marketCount.data) : 0

  const onSubmit = async (data: StakeFormData) => {
    try {
      setStatus('loading')
      setMessage('Placing stake...')

      const marketId = BigInt(data.marketId)
      const amount = parseEther(data.amount)
      const outcome = data.outcome === 'yes' ? PredictionOutcome.Yes : PredictionOutcome.No

      await placeStake.mutateAsync({
        marketId,
        outcome,
        amount,
        isEth: true,
      })

      setStatus('success')
      setMessage(`✅ Stake placed on "${data.outcome.toUpperCase()}" successfully!`)
      reset()
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to place stake'}`)
    }
  }

  if (marketCount.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-40 bg-white/5" />
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <GlassCard>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-mono tracking-tight">
              <Search className="text-cyan-400" size={24} />
              ACTIVE_MARKETS
            </h2>
            <div className="flex bg-slate-900/50 rounded-full px-4 py-1.5 border border-white/5 items-center gap-2">
              <Info size={14} className="text-slate-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol V1.2</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {count === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
                <TrendingUp size={48} className="mx-auto mb-4 text-slate-800" />
                <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No active events detected</p>
              </div>
            ) : (
              Array.from({ length: count }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${watchMarketId === idx.toString() ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                  onClick={() => setValue('marketId', idx.toString())}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-cyan-500 font-bold tracking-widest">ID #0{idx}</span>
                    <Badge variant="outline" className="text-[9px] border-green-500/20 text-green-400 bg-green-500/5">ACTIVE</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400">
                    Prediction Event: Market Narrative #{idx}
                  </h3>
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">Resolution Block</p>
                      <p className="text-xs font-mono text-slate-400">#4,290,12{idx}</p>
                    </div>
                    <div className="h-4 w-[1px] bg-white/5" />
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">Total Staked</p>
                      <p className="text-xs font-mono text-cyan-400">12.45 ETH</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="border-cyan-500/20">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <TrendingUp className="text-cyan-400" size={20} />
            <h3 className="text-xl font-bold text-white font-mono tracking-tight">STAKE_ASSETS</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Market Identifier</Label>
                <Input
                  {...register('marketId', { required: true })}
                  className="bg-slate-900/50 border-white/10 text-white font-mono"
                  readOnly
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Select Outcome</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('outcome', 'yes')}
                    className={`py-4 rounded-xl border font-bold text-sm transition-all duration-300 ${watchOutcome === 'yes' ? 'bg-green-500 border-green-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                  >
                    <CheckCircle size={16} className="inline mr-2" />
                    PREDICT YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('outcome', 'no')}
                    className={`py-4 rounded-xl border font-bold text-sm transition-all duration-300 ${watchOutcome === 'no' ? 'bg-red-500 border-red-400 text-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                  >
                    <AlertCircle size={16} className="inline mr-2" />
                    PREDICT NO
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Stake Amount (ETH)</Label>
                <div className="relative">
                  <Input
                    {...register('amount', { required: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-slate-900/50 border-white/10 text-white font-mono h-12 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-cyan-500 uppercase">ETH</span>
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-[10px] font-bold flex items-center gap-2">
                <AlertCircle size={14} /> {message}
              </div>
            )}

            {status === 'success' && (
              <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-[10px] font-bold flex items-center gap-2">
                <CheckCircle size={14} /> {message}
              </div>
            )}

            <NeonButton
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-6 font-bold tracking-widest"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : 'EXECUTE PREDICTION'}
            </NeonButton>
          </form>
        </GlassCard>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Protocol Mechanics</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            Rewards are calculated based on the total pool size for the losing outcome distributed among winners.
          </p>
        </div>
      </div>
    </div>
  )
}
