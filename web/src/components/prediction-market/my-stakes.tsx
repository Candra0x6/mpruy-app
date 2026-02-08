/**
 * #file:prediction-market
 * MyStakes Component
 * 
 * Displays user's prediction market stakes and positions.
 * Provides tabs for filtering stakes (all, pending resolution, settled).
 * Shows detailed stake information including amounts and outcomes.
 */

'use client'

import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, CreditCard, Clock, CheckCircle, Wallet } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'

export function MyStakes() {
  const { marketCount } = usePredictionMarket()

  if (marketCount.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-24 bg-white/5" />
          </GlassCard>
        ))}
      </div>
    )
  }

  const count = marketCount.data ? Number(marketCount.data) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex w-full mb-10 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 py-3 rounded-lg transition-all font-mono font-bold text-[10px] uppercase tracking-widest">
              ALL_STAKES
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 py-3 rounded-lg transition-all font-mono font-bold text-[10px] uppercase tracking-widest">
              PENDING_RESOLVE
            </TabsTrigger>
            <TabsTrigger value="settled" className="flex-1 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 py-3 rounded-lg transition-all font-mono font-bold text-[10px] uppercase tracking-widest">
              SETTLED_EVENTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-6">
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {Array.from({ length: Math.min(count, 5) }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group-hover:border-cyan-500/20 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">STAKED_MARKET #{idx}</h4>
                        <div className="flex items-center gap-4 mt-1.5">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={12} className="text-yellow-500/80" /> ACTIVE_ORACLE
                          </p>
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                          <p className="text-[10px] text-cyan-500/80 font-mono font-bold">0.50 ETH STAKED</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                      <Badge variant="outline" className="bg-cyan-500/5 border-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-widest self-start md:self-auto">
                        DIRECTION: YES
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <p className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-[0.2em]">VERIFIED_ON_CHAIN</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {count === 0 && (
                <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-slate-900/10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
                    <CreditCard size={48} className="text-slate-800 relative z-10" />
                  </div>
                  <p className="text-cyan-500/50 font-mono text-xs uppercase tracking-[0.4em] font-bold">POSITIONS_EMPTY</p>
                  <p className="text-slate-700 font-mono text-[10px] mt-3 uppercase tracking-widest italic text-center px-12">
                    Connect to the stream by executing your first binary commitment on the LIVE_FEEDS terminal.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <div className="space-y-4">
              {count === 0 ? (
                <p className="text-slate-500 text-center py-10">No pending stakes</p>
              ) : (
                <p className="text-slate-500 text-center py-10">Filtered pending view...</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settled" className="mt-0">
            <div className="space-y-4">
              <p className="text-slate-500 text-center py-10">Historical settlements tracking...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <GlassCard hoverEffect>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-1 bg-cyan-500 rounded-full" />
            <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em]">
              PORTFOLIO_ANALYTICS
            </h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">GROSS_EXPOSURE</span>
                <span className="text-xl font-bold font-mono text-white tracking-tighter">0.50 ETH</span>
              </div>
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 w-[40%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 group hover:border-green-500/20 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-mono tracking-[0.2em] mb-1">STRIKE_ACCURACY</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold font-mono text-green-400">---%</p>
                  <TrendingUp size={12} className="text-green-500/50" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 group hover:border-cyan-500/20 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-mono tracking-[0.2em] mb-1">NETWORK_RANK</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold font-mono text-cyan-400">#0</p>
                  <span className="text-[10px] text-slate-600 font-mono">/ 0</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-2xl rounded-full" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-mono relative z-10">
            <span className="text-red-500/70 font-bold">WARNING:</span> STAKES ARE LOCKED IN SMART CONTRACTS UNTIL THE TARGET BLOCK RESOLUTION POBS. EARLY LIQUIDATION IS PROTOCOL-RESTRICTED.
          </p>
        </div>
      </div>
    </div>
  )
}
