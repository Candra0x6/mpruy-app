/**
 * #file:group-pool
 * PoolDashboard Component
 * 
 * Displays an overview of all group pools with their key information.
 * Shows pool names, member counts, and balances in a grid layout.
 * Handles pool loading states and provides pool selection functionality.
 */

'use client'

import { useEffect, useState } from 'react'
import { useGroupPool } from '@/hooks/useGroupPool'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Users, Wallet, Plus, Shield } from 'lucide-react'
import { Badge } from '../ui/badge'
import { GlassCard } from '../ui/glass-card'
import { NeonButton } from '../ui/neon-button'
import { motion } from 'framer-motion'

interface PoolDashboardProps {
    onSelectPool: (poolId: bigint) => void
}

export function PoolDashboard({ onSelectPool }: PoolDashboardProps) {
    const { getPool, getMemberCount } = useGroupPool()
    const [pools, setPools] = useState<Array<{ id: bigint; name: string; memberCount: number; balance: bigint }>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadPools = async () => {
            try {
                setIsLoading(true)
                // Placeholder for now
                setPools([])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load pools')
            } finally {
                setIsLoading(false)
            }
        }

        loadPools()
    }, [])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <GlassCard key={i}>
                        <Skeleton className="h-48 bg-white/5 rounded-xl" />
                    </GlassCard>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <GlassCard className="border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                        <span className="text-red-500 font-bold font-mono">!</span>
                    </div>
                    <div>
                        <h3 className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold">SYSTEM_ERROR</h3>
                        <p className="text-red-400/80 text-[11px] font-mono italic mt-1">{error}</p>
                    </div>
                </div>
            </GlassCard>
        )
    }

    if (pools.length === 0) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <GlassCard>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-cyan-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">ACTIVE_CLUSTERS</p>
                                <h3 className="text-4xl font-bold font-mono text-white tracking-tighter">00</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                <Shield className="text-cyan-400" size={20} />
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">TOTAL_MEMBERS</p>
                                <h3 className="text-4xl font-bold font-mono text-white tracking-tighter">00</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Users className="text-blue-400" size={20} />
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-500/70 text-[10px] uppercase tracking-[0.2em] font-mono mb-2">AGGREGATE_TREASURY</p>
                                <h3 className="text-4xl font-bold font-mono text-white tracking-tighter">0.00</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Wallet className="text-purple-400" size={20} />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-slate-900/10">
                    <Activity size={48} className="text-slate-800 mb-8" />
                    <p className="text-cyan-500/50 font-mono text-xs uppercase tracking-[0.4em] font-bold">NO_CLUSTERS_DETECTED</p>
                    <p className="text-slate-700 font-mono text-[10px] mt-3 uppercase tracking-widest italic text-center max-w-sm px-6">
                        Your neural signature is not associated with any active staking pools. Initialize a new cluster to begin collective execution.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools.map((pool) => (
                    <GlassCard key={pool.id.toString()} onClick={() => onSelectPool(pool.id)} hoverEffect className="cursor-pointer group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                    {pool.name}
                                </h3>
                                <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                                    CLUSTER_ID: {pool.id.toString()}
                                </p>
                            </div>
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest">
                                ACTIVE
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Wallet className="text-blue-400" size={16} />
                                    </div>
                                    <span className="text-[11px] text-slate-400 uppercase font-mono">POOL_BALANCE</span>
                                </div>
                                <span className="text-sm font-mono text-white">{(Number(pool.balance) / 1e18).toFixed(4)} ETH</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Users className="text-purple-400" size={16} />
                                    </div>
                                    <span className="text-[11px] text-slate-400 uppercase font-mono">NODE_COUNT</span>
                                </div>
                                <span className="text-sm font-mono text-white">{pool.memberCount} MBRS</span>
                            </div>

                            <NeonButton
                                variant="cyan"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPool(pool.id);
                                }}
                                className="w-full mt-2"
                            >
                                ACCESS_CLUSTER
                            </NeonButton>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
