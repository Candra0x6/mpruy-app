'use client'

import { useEffect, useState } from 'react'
import { useMultiSigWallet } from '@/hooks/useMultiSigWallet'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Lock, Users, GitMerge, AlertCircle, Shield, ArrowRight, Activity } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'

export function WalletDashboard() {
  const { walletDetails, owners } = useMultiSigWallet()
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [isLoadingOwners, setIsLoadingOwners] = useState(true)

  useEffect(() => {
    if (walletDetails) {
      setIsLoadingDetails(false)
    }
  }, [walletDetails])

  useEffect(() => {
    if (owners) {
      setIsLoadingOwners(false)
    }
  }, [owners])

  const walletData = walletDetails?.data
  const ownersList = owners?.data as `0x${string}`[] | undefined

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Total Assets</p>
              {isLoadingDetails ? (
                <Skeleton className="h-10 w-24 bg-white/5 mt-3" />
              ) : (
                <h3 className="text-3xl font-bold text-white mt-3 tracking-tighter">
                  {walletData ? (Number(walletData) / 1e18).toFixed(4) : '0'} <span className="text-cyan-500 text-lg">ETH</span>
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Lock className="text-cyan-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-medium uppercase tracking-tight">On-chain Verified</span>
          </div>
        </GlassCard>

        {/* Required Confirmations */}
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Quorum Requirement</p>
              {isLoadingDetails ? (
                <Skeleton className="h-10 w-24 bg-white/5 mt-3" />
              ) : (
                <h3 className="text-3xl font-bold text-white mt-3 tracking-tighter">
                  {walletData ? `${(walletData as any).requiredConfirmations ?? '0'}` : '0'} <span className="text-purple-500 text-lg">sigs</span>
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <GitMerge className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Approval Threshold</p>
          </div>
        </GlassCard>

        {/* Total Owners */}
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Trusted Signers</p>
              {isLoadingOwners ? (
                <Skeleton className="h-10 w-24 bg-white/5 mt-3" />
              ) : (
                <h3 className="text-3xl font-bold text-white mt-3 tracking-tighter">
                  {ownersList?.length ?? '0'} <span className="text-blue-500 text-lg">users</span>
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-2 py-0 text-[10px]">
              MULTISIG-V1
            </Badge>
          </div>
        </GlassCard>
      </div>

      {/* Main Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="text-cyan-400" size={20} />
              <h3 className="text-xl font-bold text-white font-mono tracking-tight">VAULT CONFIGURATION</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/20 transition-all">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Protocol Status</p>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    <span className="text-sm font-medium text-slate-200">Active & Syncing</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/20 transition-all">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Security Level</p>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-cyan-400" />
                    <span className="text-sm font-medium text-slate-200">High (Multi-Owner)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Governance Guide</h4>
                <ul className="space-y-3">
                  {[
                    "Propose transactions with target and value",
                    "Required approvals must be met for execution",
                    "Any owner can trigger execution once quorum reached",
                    "Security pause available for critical updates"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <ArrowRight size={14} className="mt-1 text-cyan-500" />
                      <p className="text-xs text-slate-400 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-b from-slate-900/50 to-cyan-900/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Lock size={32} className="text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Secure Vault</h3>
            <p className="text-slate-400 text-sm px-4">Assets are locked behind smart-contract collective ownership.</p>
          </div>
          <div className="pt-4 w-full">
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis">
              VERIFIED AT 0x...{walletDetails?.data ? 'OWNED' : 'UNINITIALIZED'}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
