'use client'

import { motion } from 'framer-motion'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { TrendingUp, ShieldCheck, Zap, ArrowRight, Layers, Cpu, Globe } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden py-10 px-8">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/20 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em]">System_v4.2_Online</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
            REDEFINE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">PROBABILITY_</span>
          </h1>

          <p className="text-slate-400 font-mono text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            MPRUY is a high-fidelity prediction architecture designed for the decentralized elite.
            Execution-grade markets. Multi-sig security. Protocol-level yields.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/prediction-market">
              <NeonButton className="px-10 h-14 text-sm tracking-[0.3em] font-bold">
                ENTER_TERMINAL <ArrowRight className="ml-2" size={18} />
              </NeonButton>
            </Link>
            <Link href="/multi-sig">
              <button className="h-14 px-10 rounded-full border border-white/10 bg-white/5 text-slate-400 font-mono text-xs tracking-widest hover:text-white hover:bg-white/10 transition-all uppercase">
                SECURITY_VAULT
              </button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: <TrendingUp className="text-cyan-400" />,
              title: "BINARY_FEEDS",
              desc: "Deploy prediction nodes on real-time on-chain and off-chain data streams."
            },
            {
              icon: <ShieldCheck className="text-blue-400" />,
              title: "VAULT_PROTOCOL",
              desc: "Industrial-grade multi-signature modules for asset sovereignty."
            },
            {
              icon: <Zap className="text-indigo-400" />,
              title: "QUANTUM_YIELD",
              desc: "Proprietary stake mechanisms for optimized liquidity across all events."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <GlassCard hoverEffect className="h-full border-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-mono font-bold text-white mb-3 uppercase tracking-widest">{feature.title}</h3>
                <p className="text-[11px] text-slate-500 font-mono leading-relaxed uppercase opacity-70 italic">
                  {feature.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-32 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Cpu size={14} /> CORE_01
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <Globe size={14} /> NODES_104
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <Layers size={14} /> LAYER_02
            </div>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-slate-500">
            COPYRIGHT © 2024 MPRUY_SYSTEMS. ALL RIGHTS RESERVED.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
