import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { GlassCard, Badge, NeonButton } from './components/UI';
import { CryptoChart } from './components/Charts';
import { GeminiAnalyst } from './components/GeminiAnalyst';
import { CryptoAsset, Transaction } from './types';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp, Search } from 'lucide-react';

// Mock Data
const MOCK_ASSETS: CryptoAsset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 94321.50,
        change24h: 2.4,
        volume: '42.1B',
        marketCap: '1.8T',
        chartData: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 90000 + Math.random() * 5000 }))
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3450.20,
        change24h: -1.2,
        volume: '15.4B',
        marketCap: '412B',
        chartData: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 3200 + Math.random() * 400 }))
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: 145.80,
        change24h: 5.7,
        volume: '4.2B',
        marketCap: '65B',
        chartData: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 130 + Math.random() * 30 }))
    }
];

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'buy', asset: 'BTC', amount: 0.045, price: 93500, date: '10:42 AM', status: 'completed' },
    { id: '2', type: 'sell', asset: 'ETH', amount: 1.2, price: 3400, date: '09:15 AM', status: 'completed' },
    { id: '3', type: 'buy', asset: 'SOL', amount: 50, price: 142, date: 'Yesterday', status: 'pending' },
];

const App: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(MOCK_ASSETS[0]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-obsidian text-white font-sans selection:bg-primary/30 selection:text-primary">
            <Sidebar />

            <main className="lg:ml-64 p-6 lg:p-10 space-y-8 min-h-screen relative overflow-hidden">
                {/* Background Ambient Glows - Unified Primary Color */}
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-light text-white tracking-wide">
                            Hello, <span className="font-semibold text-primary">Alex</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder-gray-600"
                            />
                        </div>
                        <NeonButton>Connect Wallet</NeonButton>
                    </div>
                </header>

                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    <GlassCard className="flex items-center gap-4" hoverEffect>
                        <div className="p-3 rounded-full bg-primary/20 border border-primary/20">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Total Balance</p>
                            <h3 className="text-2xl font-bold text-white">$124,592.00</h3>
                            <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                                <ArrowUpRight className="w-3 h-3" /> +12.5%
                            </div>
                        </div>
                    </GlassCard>

                    {MOCK_ASSETS.map((asset) => (
                        <GlassCard
                            key={asset.id}
                            className="cursor-pointer transition-transform hover:-translate-y-1"
                            hoverEffect
                        >
                            <div onClick={() => setSelectedAsset(asset)}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs border border-white/10 text-primary">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{asset.symbol}</h4>
                                            <p className="text-xs text-gray-500">{asset.name}</p>
                                        </div>
                                    </div>
                                    <Badge type={asset.change24h > 0 ? 'success' : 'danger'}>
                                        {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold">${asset.price.toLocaleString()}</h3>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

                    {/* Main Chart Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="h-[400px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                                        <Activity className="w-5 h-5 text-primary" />
                                        Market Overview
                                    </h3>
                                    <p className="text-xs text-gray-500">Live data for {selectedAsset.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                                        <button
                                            key={tf}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${tf === '1D' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                {/* Passed primary color to chart or semantic color if you prefer specific asset coloring */}
                                <CryptoChart data={selectedAsset.chartData} color={selectedAsset.change24h >= 0 ? '#00f3ff' : '#f87171'} />
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassCard>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Recent Transactions
                                </h3>
                                <div className="space-y-4">
                                    {MOCK_TRANSACTIONS.map(tx => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {tx.type === 'buy' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                                        {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.asset}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${tx.type === 'buy' ? 'text-white' : 'text-white'}`}>
                                                    {tx.type === 'buy' ? '+' : '-'}{tx.amount} {tx.asset}
                                                </p>
                                                <Badge type={tx.status === 'completed' ? 'neutral' : 'warning'}>{tx.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>

                            <GlassCard>
                                <h3 className="text-lg font-semibold mb-4 text-white">Asset Allocation</h3>
                                <div className="space-y-4">
                                    {MOCK_ASSETS.map(asset => (
                                        <div key={asset.id} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">{asset.name}</span>
                                                <span className="text-white font-medium">35%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/80 shadow-[0_0_10px_rgba(0,243,255,0.3)] rounded-full"
                                                    style={{ width: `${Math.random() * 40 + 20}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <NeonButton className="w-full text-xs">Rebalance Portfolio</NeonButton>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Right Column (AI & Extra) */}
                    <div className="lg:col-span-1 space-y-6">
                        <GeminiAnalyst assets={MOCK_ASSETS} />

                        <GlassCard className="bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent transition-opacity" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-2">Learn Web3</h3>
                                <p className="text-sm text-gray-300 mb-4">Master DeFi strategies and security protocols.</p>
                                <button className="text-primary text-sm font-semibold hover:underline decoration-primary underline-offset-4">Start Course →</button>
                            </div>
                        </GlassCard>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default App;