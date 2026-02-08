'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, XCircle, Clock, Search, History, ArrowUpRight, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { motion, AnimatePresence } from 'framer-motion'

interface TransactionRecord {
  id: bigint
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
  status: 'executed' | 'failed' | 'pending'
  executedAt?: number
  confirmations: number
}

export function TransactionHistory() {
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Placeholder for actual data loading
  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch =
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toString().includes(searchTerm)

    if (activeTab === 'executed') return tx.status === 'executed' && matchesSearch
    if (activeTab === 'failed') return tx.status === 'failed' && matchesSearch
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-full bg-white/5" />
        <Skeleton className="h-40 w-full bg-white/5" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GlassCard className="border-cyan-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <History className="text-cyan-400" size={20} />
            <h3 className="text-xl font-bold text-white font-mono tracking-tight">TRANSACTION ARCHIVE</h3>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <Input
              placeholder="Filter by hash or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 pl-10 h-10 ring-offset-slate-950 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-800/50 p-1 text-slate-400 border border-white/5 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white px-4">All Events</TabsTrigger>
            <TabsTrigger value="executed" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4">Executed</TabsTrigger>
            <TabsTrigger value="failed" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 px-4">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 outline-none">
            <AnimatePresence mode="wait">
              {filteredTxs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 border border-dashed border-white/5 rounded-2xl"
                >
                  <Filter className="mx-auto mb-4 text-slate-700" size={40} />
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No matching archival records</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredTxs.map((tx, idx) => (
                    <motion.div
                      key={tx.id.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className={`p-2 rounded-lg ${tx.status === 'executed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {tx.status === 'executed' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold font-mono text-slate-500">#{tx.id.toString()}</span>
                          <span className="text-sm font-bold text-slate-200">{Number(tx.value) / 1e18} ETH</span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 truncate">{tx.to}</p>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-600 tracking-tighter">Confirmations</p>
                          <p className="text-xs font-mono text-slate-400">{tx.confirmations} SIGS</p>
                        </div>
                        <button className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                          <ArrowUpRight size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </div>
  )
}
