'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletDashboard } from '@/components/multi-sig/wallet-dashboard'
import { SubmitTransactionForm } from '@/components/multi-sig/submit-transaction-form'
import { PendingTransactions } from '@/components/multi-sig/pending-transactions'
import { TransactionHistory } from '@/components/multi-sig/transaction-history'
import { ManageOwners } from '@/components/multi-sig/manage-owners'
import { motion } from 'framer-motion'
import { Shield, LayoutDashboard, Send, Clock, Users, AlertCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function MultiSigWalletPage() {
  const { address, isConnected } = useAccount()
  const [selectedTxId, setSelectedTxId] = useState<bigint | null>(null)

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <GlassCard className="border-red-500/20">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-lg bg-red-500/10">
                <span className="text-red-500 font-bold font-mono text-xl">!</span>
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">Access_Denied</h2>
                <p className="text-[11px] text-red-400/80 font-mono italic mt-1">WALLET_NOT_CONNECTED. PLEASE_INITIALIZE_AUTHENTICATION_STREAM.</p>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-cyan-500/50" />
                <span className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase">Security Protocol</span>
              </div>
              <h1 className="text-6xl font-bold text-white tracking-tighter mb-4">
                MULTI-SIG <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">VAULT_</span>
              </h1>
              <p className="text-slate-400 font-mono text-sm max-w-2xl leading-relaxed">
                Collaborative governance interface for secure multi-owner decision making.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 font-mono">Authenticated_Node</p>
              <p className="font-mono text-xs text-cyan-400/80 select-all tracking-tight">{address}</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="inline-flex bg-slate-900/50 p-1 border border-white/5 rounded-full mb-12">
            {[
              { value: 'dashboard', label: 'DASHBOARD' },
              { value: 'submit', label: 'PROPOSE' },
              { value: 'pending', label: 'AWAITING' },
              { value: 'history', label: 'HISTORY' },
              { value: 'owners', label: 'SIGNERS' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none">
            <WalletDashboard />
          </TabsContent>

          {/* Submit Transaction Tab */}
          <TabsContent value="submit" className="mt-0 focus-visible:outline-none">
            <SubmitTransactionForm />
          </TabsContent>

          {/* Pending Transactions Tab */}
          <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
            <PendingTransactions onSelectTx={setSelectedTxId} selectedTxId={selectedTxId} />
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="mt-0 focus-visible:outline-none">
            <TransactionHistory />
          </TabsContent>

          {/* Manage Owners Tab */}
          <TabsContent value="owners" className="mt-0 focus-visible:outline-none">
            <ManageOwners />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
