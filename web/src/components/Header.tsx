'use client'

import { useConnect, useDisconnect, useAccount, useBalance, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { NeonButton } from '@/components/ui/neon-button'
import { Wallet, Globe, LogOut, Activity, BarChart3, Shield, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
    const { connect } = useConnect()
    const { disconnect } = useDisconnect()
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const pathname = usePathname()
    const { data: balanceData } = useBalance({ address: address || undefined })

    const navItems = [
        { label: 'TERMINAL', href: '/prediction-market', icon: <BarChart3 size={14} /> },
        { label: 'SECURITY', href: '/multi-sig', icon: <Shield size={14} /> },
        { label: 'CLUSTERS', href: '/group-pool', icon: <Users size={14} /> },
    ]

    const chainNames: Record<number, string> = {
        1: 'Mainnet',
        11155111: 'Sepolia',
        31337: 'Localhost',
    }

    const chainName = chainNames[chainId] || `Chain ${chainId}`
    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
    const formatBalance = (balance: bigint | undefined, decimals: number = 18) => {
        if (!balance) return '0'
        const num = Number(balance) / Math.pow(10, decimals)
        return num.toFixed(4)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6"
            >
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                            <Activity className="text-cyan-400" size={20} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter text-white font-mono">
                            MPRUY<span className="text-cyan-500">_</span>
                        </h1>
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-white/5">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${pathname === item.href
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-8">
                    {isConnected && address ? (
                        <>
                            <div className="hidden md:flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Address</p>
                                    <div className="flex items-center gap-1.5">
                                        <Wallet size={12} className="text-cyan-400" />
                                        <p className="font-mono text-sm font-semibold text-slate-200">{formatAddress(address)}</p>
                                    </div>
                                </div>

                                <div className="h-8 w-[1px] bg-white/5" />

                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Balance</p>
                                    <p className="font-mono text-sm font-semibold text-white">
                                        {formatBalance(balanceData?.value, balanceData?.decimals)} <span className="text-cyan-400">{balanceData?.symbol || 'ETH'}</span>
                                    </p>
                                </div>

                                <div className="h-8 w-[1px] bg-white/5" />

                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Network</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Globe size={12} className="text-green-400" />
                                        <p className="font-mono text-sm font-semibold text-slate-200">{chainName}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => disconnect()}
                                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:border-red-500/50"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Disconnect</span>
                            </button>
                        </>
                    ) : (
                        <NeonButton
                            onClick={() => connect({ connector: injected() })}
                            className="font-bold py-2.5"
                        >
                            <Wallet size={18} />
                            CONNECT WALLET
                        </NeonButton>
                    )}
                </div>
            </motion.div>
        </header>
    )
}
