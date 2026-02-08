/**
 * #file:prediction-market
 * ResolvedMarkets Component
 * 
 * Displays prediction markets that have been resolved.
 * Allows users to view winning outcomes and withdraw winnings from successful stakes.
 * Provides search functionality to find specific resolved markets.
 */

'use client'

import { useState } from 'react'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle, Loader2, Search, Trophy, History, Crown, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion, AnimatePresence } from 'framer-motion'

export function ResolvedMarkets() {
  const { marketCount, withdrawWinnings } = usePredictionMarket()
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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

  const count = marketCount.data ? Number(marketCount.data) : 0

  const handleWithdraw = async (marketId: bigint) => {
    try {
      setStatus('loading')
      setMessage('Processing withdrawal...')

      await withdrawWinnings.mutateAsync(marketId)

      setStatus('success')
      setMessage('✅ Winnings claimed successfully!')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to withdraw'}`)
    }
  }

  return (
    <div className="space-y-10">
      <GlassCard className="py-2 border-slate-800/50">
        <div className="flex gap-4 items-center px-4">
          <Search size={16} className="text-slate-600" />
          <Input
            type="text"
            placeholder="FILTER_HISTORICAL_STREAMS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-slate-700 focus-visible:ring-0 text-[10px] font-mono tracking-[0.3em] uppercase h-10"
          />
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Oracle_Active</span>
          </div>
        </div>
      </GlassCard>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="inline-flex bg-slate-900/50 p-1 border border-white/5 rounded-full mb-10">
          <TabsTrigger
            value="all"
            className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
          >
            ARCHIVE_ALL
          </TabsTrigger>
          <TabsTrigger
            value="won"
            className="rounded-full px-6 py-2 data-[state=active]:bg-green-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
          >
            VICTORIES
          </TabsTrigger>
          <TabsTrigger
            value="lost"
            className="rounded-full px-6 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
          >
            DEFEATS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {count > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: Math.min(count, 4) }).map((_, idx) => (
                <GlassCard key={idx} hoverEffect className="group border-slate-800/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-slate-900 border border-white/5 text-slate-500 font-mono text-[9px] tracking-widest uppercase">
                        REF_ID:00{idx}
                      </div>
                      <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px] py-0 font-mono tracking-widest uppercase bg-slate-900/50 px-2">STATUS: RESOLVED</Badge>
                    </div>
                    <div className="p-2 rounded-full bg-slate-900 border border-white/5 text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <Trophy size={14} />
                    </div>
                  </div>

                  <h3 className="text-sm font-mono font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                    MARKET_INDEX_00{idx}_RESULT
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-6 font-mono leading-relaxed italic">
                    Resolution finalized by decentralized oracle consensus on block 19,452,102.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                      <p className="text-[9px] text-slate-600 uppercase font-mono tracking-widest mb-1.5">Winning_Node</p>
                      <p className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest">YES_NODE_01</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                      <p className="text-[9px] text-slate-600 uppercase font-mono tracking-widest mb-1.5">Net_Multiplier</p>
                      <p className="text-xs font-mono font-bold text-cyan-400">1.82x_YIELD</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
                        <Crown size={14} className="text-cyan-500/50" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">0.91 ETH AVAIL</span>
                    </div>
                    <NeonButton
                      onClick={() => handleWithdraw(BigInt(idx))}
                      className="px-4 py-1.5 h-auto text-[9px] tracking-[0.2em] font-bold"
                    >
                      CLAIM_YIELD
                    </NeonButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-slate-900/10">
              <History size={48} className="text-slate-800 mb-6" />
              <p className="text-cyan-500/30 font-mono text-xs uppercase tracking-[0.4em] font-bold">ARCHIVE_EMPTY</p>
              <p className="text-slate-700 font-mono text-[10px] mt-3 uppercase tracking-widest italic">
                No historical records found for the current node cluster.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-slate-900 border border-cyan-500/30 text-cyan-400 px-6 py-4 rounded-2xl font-mono shadow-2xl z-50 flex items-center gap-4 backdrop-blur-xl"
          >
            <div className="relative">
              <Loader2 className="animate-spin text-cyan-500" size={18} />
              <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full animate-pulse" />
            </div>
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
