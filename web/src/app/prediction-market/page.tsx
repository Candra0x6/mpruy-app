'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, TrendingUp, PlusCircle, LayoutDashboard, History, CheckCircle } from 'lucide-react'
import { MarketDashboard } from '@/components/prediction-market/market-dashboard'
import { CreateMarketForm } from '@/components/prediction-market/create-market-form'
import { ActiveMarkets } from '@/components/prediction-market/active-markets'
import { MyStakes } from '@/components/prediction-market/my-stakes'
import { ResolvedMarkets } from '@/components/prediction-market/resolved-markets'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'

export default function PredictionMarketPage() {
  const { isConnected } = useAccount()
  const [selectedMarketId, setSelectedMarketId] = useState<bigint | null>(null)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <GlassCard className="border-red-500/20">
            <div className="flex gap-3 items-center">
              <AlertCircle size={24} className="text-red-500" />
              <div>
                <h2 className="font-semibold text-red-300">Wallet Not Connected</h2>
                <p className="text-sm text-red-400/80">Please connect your wallet to access the prediction market.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase">Market Protocol</span>
          </div>
          <h2 className="text-6xl font-bold text-white tracking-tighter mb-4">
            PREDICTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">TERMINAL_</span>
          </h2>
          <p className="text-slate-400 font-mono text-sm max-w-2xl leading-relaxed">
            Execute binary outcome stakes on decentralized data feeds.
            MPRUY proprietary prediction engine for high-fidelity assets.
          </p>
        </motion.div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="inline-flex bg-slate-900/50 p-1 border border-white/5 rounded-full mb-12">
            <TabsTrigger
              value="dashboard"
              className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
            >
              DASHBOARD
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
            >
              CREATE_MARKET
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
            >
              LIVE_FEEDS
            </TabsTrigger>
            <TabsTrigger
              value="stakes"
              className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
            >
              MY_POSITIONS
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
            >
              HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <MarketDashboard onSelectMarket={setSelectedMarketId} />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <CreateMarketForm />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <ActiveMarkets selectedMarketId={selectedMarketId} />
          </TabsContent>

          <TabsContent value="stakes" className="mt-0">
            <MyStakes />
          </TabsContent>

          <TabsContent value="resolved" className="mt-0">
            <ResolvedMarkets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

