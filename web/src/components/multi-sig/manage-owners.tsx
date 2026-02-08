'use client'

import { useEffect, useState } from 'react'
import { useMultiSigWallet } from '@/hooks/useMultiSigWallet'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, AlertCircle, Shield, Fingerprint, Crown, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion, AnimatePresence } from 'framer-motion'

export function ManageOwners() {
  const { owners, walletDetails, userAddress } = useMultiSigWallet()
  const [ownersList, setOwnersList] = useState<`0x${string}`[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (owners?.data) {
      setOwnersList(owners.data as `0x${string}`[])
      setIsLoading(false)
    }
  }, [owners])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-24 bg-white/5 rounded-2xl" />
          <Skeleton className="h-24 bg-white/5 rounded-2xl" />
        </div>
        <Skeleton className="h-64 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Owner Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Owners */}
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Total Governance Set</p>
              <h3 className="text-3xl font-bold text-white mt-3 tracking-tighter">
                {ownersList.length} <span className="text-cyan-500 text-lg">Signers</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Users className="text-cyan-400" size={24} />
            </div>
          </div>
        </GlassCard>

        {/* Current User Role */}
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Authentication Profile</p>
              <h3 className="text-3xl font-bold text-white mt-3 tracking-tighter">
                {ownersList.includes(userAddress as `0x${string}`) ? (
                  <span className="text-green-400">AUTHORIZED</span>
                ) : (
                  <span className="text-red-400">UNAUTHORIZED</span>
                )}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Fingerprint className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full animate-pulse ${ownersList.includes(userAddress as `0x${string}`) ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-[10px] font-bold uppercase ${ownersList.includes(userAddress as `0x${string}`) ? 'text-green-400' : 'text-red-400'}`}>
              Session Root Access: {ownersList.includes(userAddress as `0x${string}`) ? 'Granted' : 'Denied'}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Owners List */}
      <GlassCard className="border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
          <Shield className="text-cyan-400" size={20} />
          <h3 className="text-xl font-bold text-white font-mono tracking-tight">AUTHORIZED SIGNATORIES</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {ownersList.map((owner, index) => {
              const isMe = owner.toLowerCase() === userAddress?.toLowerCase()
              return (
                <motion.div
                  key={owner}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${isMe
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold font-mono ${isMe
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-mono truncate ${isMe ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                        {owner}
                      </p>
                      {isMe && <Crown size={12} className="text-cyan-400 flex-shrink-0" />}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className={`text-[9px] py-0 border-white/10 ${isMe ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500'}`}>
                        {isMe ? 'CURRENT SESSION' : 'EXTERNAL SIGNER'}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] py-0 border-white/10 text-slate-500">
                        VOTING POWER: 1
                      </Badge>
                    </div>
                  </div>

                  {isMe && (
                    <div className="p-1 rounded-full bg-cyan-500/20">
                      <CheckCircle2 size={16} className="text-cyan-400" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </GlassCard>

      <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-white/5">
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <AlertCircle className="text-yellow-500" size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Protocol Warning</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Owners have full control over the vault's assets. Ensure all owner addresses are
            verified and secure. Changes to owners must pass the current quorum threshold.
          </p>
        </div>
      </div>
    </div>
  )
}
