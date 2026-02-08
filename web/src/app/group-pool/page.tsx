'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { StakeInMarketForm } from '@/components/group-pool/stake-in-market-form'
import { DepositFundsForm } from '@/components/group-pool/deposit-funds-form'
import { ManageMembersForm } from '@/components/group-pool/manage-members-form'
import { CreatePoolForm } from '@/components/group-pool/create-pool-form'
import { PoolDashboard } from '@/components/group-pool/pool-dashboard'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
export default function GroupPoolPage() {
    const { address, isConnected } = useAccount()
    const [selectedPoolId, setSelectedPoolId] = useState<bigint | null>(null)
    const [showDisconnectWarning, setShowDisconnectWarning] = useState(false)

    if (!isConnected || !address) {
        return (
            <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px w-12 bg-cyan-500/50" />
                        <span className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase">Collective Protocol</span>
                    </div>
                    <h2 className="text-6xl font-bold text-white tracking-tighter mb-4">
                        GROUP_POOL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">MINT_</span>
                    </h2>
                    <p className="text-slate-400 font-mono text-sm max-w-2xl leading-relaxed">
                        Collaborative staking clusters. Multi-sig authenticated treasury management.
                        Connected as: <span className="text-cyan-400 opacity-80">{address.slice(0, 6)}...{address.slice(-4)}</span>
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
                            CREATE_POOL
                        </TabsTrigger>
                        <TabsTrigger
                            value="members"
                            className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
                        >
                            MEMBERS_HUB
                        </TabsTrigger>
                        <TabsTrigger
                            value="deposit"
                            className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
                        >
                            TREASURY_IN
                        </TabsTrigger>
                        <TabsTrigger
                            value="stake"
                            className="rounded-full px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-400 font-mono text-[10px] tracking-widest transition-all uppercase"
                        >
                            DEPLOY_STAKE
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="mt-0">
                        <PoolDashboard onSelectPool={setSelectedPoolId} />
                    </TabsContent>

                    {/* Create Pool Tab */}
                    <TabsContent value="create" className="mt-0">
                        <div className="max-w-2xl">
                            <CreatePoolForm />
                        </div>
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="mt-0">
                        {selectedPoolId ? (
                            <div className="max-w-2xl">
                                <ManageMembersForm poolId={selectedPoolId} />
                            </div>
                        ) : (
                            <GlassCard className="py-24 flex flex-col items-center justify-center border-dashed border-white/5 bg-slate-900/10">
                                <p className="text-cyan-500/30 font-mono text-xs uppercase tracking-[0.4em] font-bold">SELECT_POOL_FIRST</p>
                                <p className="text-slate-700 font-mono text-[10px] mt-3 uppercase tracking-widest italic">
                                    Initialize a session via the dashboard to access member registry.
                                </p>
                            </GlassCard>
                        )}
                    </TabsContent>

                    {/* Deposit Tab */}
                    <TabsContent value="deposit">
                        <Card className="border-slate-700 bg-slate-900">
                            <CardHeader>
                                <CardTitle>Deposit Funds</CardTitle>
                                <CardDescription>
                                    Contribute ETH or tokens to the pool
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedPoolId ? (
                                    <DepositFundsForm poolId={selectedPoolId} />
                                ) : (
                                    <div className="text-slate-400 text-center py-8">
                                        <p>Select a pool from the Dashboard to deposit funds</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Stake Tab */}
                    <TabsContent value="stake">
                        <Card className="border-slate-700 bg-slate-900">
                            <CardHeader>
                                <CardTitle>Collective Betting</CardTitle>
                                <CardDescription>
                                    Propose and stake the pool's funds in prediction markets
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedPoolId ? (
                                    <StakeInMarketForm poolId={selectedPoolId} />
                                ) : (
                                    <div className="text-slate-400 text-center py-8">
                                        <p>Select a pool from the Dashboard to stake in markets</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <AlertDialog open={showDisconnectWarning} onOpenChange={setShowDisconnectWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Wallet Disconnected</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your wallet has been disconnected. Please reconnect to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction onClick={() => setShowDisconnectWarning(false)}>
                        OK
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
