/**
 * #file:multi-sig
 * PendingTransactions Component
 * 
 * Displays pending multi-sig wallet transactions awaiting confirmation.
 * Shows confirmation progress, allows confirmation/execution of transactions,
 * and handles transaction selection for detailed review.
 */

'use client'

import { useEffect, useState } from 'react'
import { useMultiSigWallet } from '@/hooks/useMultiSigWallet'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle2, Clock, Send, Loader, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion, AnimatePresence } from 'framer-motion'

interface Transaction {
  id: bigint
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
  executed: boolean
  confirmations: number
  requiredConfirmations: number
}

interface PendingTransactionsProps {
  onSelectTx: (txId: bigint) => void
  selectedTxId: bigint | null
}

export function PendingTransactions({ onSelectTx, selectedTxId }: PendingTransactionsProps) {
  const { userAddress } = useMultiSigWallet()
  const { confirmTransaction, executeTransaction } = useMultiSigWallet()
  const [pendingTxs, setPendingTxs] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'confirming' | 'executing'>('idle')
  const [selectedAction, setSelectedAction] = useState<bigint | null>(null)

  // Mock data - would come from contract queries
  useEffect(() => {
    setIsLoading(false)
    // Placeholder for actual transaction loading
    setPendingTxs([
      // Adding a mock tx to see the style
      {
        id: BigInt(1),
        to: '0x1234...5678' as `0x${string}`,
        value: BigInt(500000000000000000), // 0.5 ETH
        data: '0x',
        executed: false,
        confirmations: 1,
        requiredConfirmations: 2
      }
    ])
  }, [])

  const handleConfirm = async (txId: bigint) => {
    try {
      setActionStatus('confirming')
      setSelectedAction(txId)
      await confirmTransaction.mutateAsync(txId)
    } catch (error) {
      console.error('Failed to confirm:', error)
    } finally {
      setActionStatus('idle')
      setSelectedAction(null)
    }
  }

  const handleExecute = async (txId: bigint) => {
    try {
      setActionStatus('executing')
      setSelectedAction(txId)
      await executeTransaction.mutateAsync(txId)
    } catch (error) {
      console.error('Failed to execute:', error)
    } finally {
      setActionStatus('idle')
      setSelectedAction(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-32 bg-white/5" />
          </GlassCard>
        ))}
      </div>
    )
  }

  if (pendingTxs.length === 0) {
    return (
      <GlassCard className="border-dashed border-white/10">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">NO PENDING SESSIONS</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">
            Proposed transactions awaiting owner signatures will be listed here.
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {pendingTxs.map((tx, idx) => {
          const progress = (tx.confirmations / tx.requiredConfirmations) * 100
          const isQuorumReached = tx.confirmations >= tx.requiredConfirmations
          const isSelected = selectedTxId === tx.id

          return (
            <motion.div
              key={tx.id.toString()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard
                className={`transition-all duration-300 ${isSelected ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : ''}`}
                onClick={() => onSelectTx(tx.id)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side: TX Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono border-white/10 text-slate-400">
                          TX #{tx.id.toString()}
                        </Badge>
                        {isQuorumReached ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                            QUORUM REACHED
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                            AWAITING SIGS
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-bold text-white font-mono break-all">
                        {Number(tx.value) / 1e18} <span className="text-cyan-500">ETH</span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Recipient Address</p>
                      <p className="font-mono text-sm text-slate-200 truncate">{tx.to}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-slate-400">Confirmation Threshold</span>
                        <span className="text-cyan-400">{tx.confirmations} / {tx.requiredConfirmations}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full ${isQuorumReached ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex flex-col justify-center gap-3 md:w-48">
                    {!isQuorumReached ? (
                      <NeonButton
                        onClick={(e) => { e.stopPropagation(); handleConfirm(tx.id); }}
                        disabled={actionStatus !== 'idle'}
                        className="w-full text-xs py-2"
                      >
                        {actionStatus === 'confirming' && selectedAction === tx.id ? (
                          <Loader className="animate-spin" size={14} />
                        ) : (
                          <UserCheck size={14} />
                        )}
                        SIGN TX
                      </NeonButton>
                    ) : (
                      <NeonButton
                        onClick={(e) => { e.stopPropagation(); handleExecute(tx.id); }}
                        disabled={actionStatus !== 'idle'}
                        className="w-full text-xs py-2 bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                      >
                        {actionStatus === 'executing' && selectedAction === tx.id ? (
                          <Loader className="animate-spin" size={14} />
                        ) : (
                          <ShieldCheck size={14} />
                        )}
                        EXECUTE TX
                      </NeonButton>
                    )}

                    <button className="flex items-center justify-center gap-2 text-[10px] text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                      View Payload <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
