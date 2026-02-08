'use client'

import { usePredictionMarket, PredictionOutcome } from '@/hooks/usePredictionMarket'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, AlertCircle, Zap, Activity, Info } from 'lucide-react'
import { formatEther } from 'viem'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion } from 'framer-motion'

export interface MarketDashboardProps {
  onSelectMarket: (marketId: bigint) => void
}

export function MarketDashboard({ onSelectMarket }: MarketDashboardProps) {
  const { marketCount } = usePredictionMarket()

  const count = marketCount.data ? Number(marketCount.data) : 0

  if (marketCount.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-32 bg-white/5" />
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyan-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">ACTIVE_MARKETS</p>
              <h3 className="text-4xl font-bold font-mono text-white tracking-tighter">{count}</h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Activity className="text-cyan-400" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500/50 w-2/3" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 italic">LOAD: 64%</span>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">PROTOCOL_STATUS</p>
              <h3 className="text-2xl font-bold font-mono text-white tracking-tighter">OPERATIONAL</h3>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <Zap className="text-green-400" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">REALTIME_SYNC_ENABLED</span>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">NETWORK_LOAD</p>
              <h3 className="text-2xl font-bold font-mono text-white tracking-tighter">STABLE_009</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-2 py-0 font-mono text-[9px] tracking-widest">
              LATEST_VERSION_V2.1.0
            </Badge>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-3">
                <Info className="text-cyan-400" size={20} />
                <h3 className="text-sm font-mono text-white uppercase tracking-[0.3em]">
                  PROTOCOL_MANUAL_v1.0
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { title: "BROWSE_FEEDS", desc: "Access high-fidelity market data streams." },
                  { title: "EXECUTE_STAKE", desc: "Lock collateral on binary outcome nodes." },
                  { title: "MINT_EVENT", desc: "Deploy customized prediction parameters." },
                  { title: "REDEEM_REWARDS", desc: "Extract yield from verified resolutions." }
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="list-none flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5 group hover:border-cyan-500/30 transition-all cursor-default"
                  >
                    <div className="mt-1 font-mono text-cyan-500/50 text-xs">0{idx + 1}</div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider group-hover:text-cyan-300 transition-colors uppercase">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-mono leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all">
            <TrendingUp size={28} className="text-cyan-400" />
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-lg font-mono font-bold tracking-tight text-white uppercase">INIT_INTERFACE</h3>
            <p className="text-slate-500 font-mono text-[11px] px-8 leading-relaxed italic">
              "Enter the stream. Predict the outcome. Control the narrative."
            </p>
          </div>

          <div className="w-full space-y-3 pt-4 relative z-10 px-4">
            <NeonButton className="w-full text-[10px] tracking-[0.2em] font-bold">
              ACCESS_MARKETS
            </NeonButton>
            <button className="w-full py-2.5 rounded-full border border-white/5 text-slate-500 font-mono text-[10px] tracking-widest hover:text-cyan-400 hover:bg-cyan-500/5 transition-all uppercase">
              DEVIATE_NEW_STREAM
            </button>
          </div>
        </GlassCard>
      </div>

    </div>
  )
}
