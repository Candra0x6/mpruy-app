/**
 * #file:prediction-market
 * CreateMarketForm Component
 * 
 * Form for creating new prediction markets.
 * Handles market description, resolution timeframe, and outcome conditions.
 * Calculates resolution block numbers and submits market creation transactions.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useBlockNumber } from 'wagmi'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { CONTRACT_ADDRESSES } from '@/config/contracts'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader2, Sparkles, HelpCircle, Info } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion } from 'framer-motion'

interface CreateMarketFormData {
  description: string
  resolution: string
  condition: string
}

export function CreateMarketForm() {
  const { createMarket } = usePredictionMarket()
  const { data: currentBlock } = useBlockNumber()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMarketFormData>({
    defaultValues: {
      description: '',
      resolution: '100',
      condition: '1',
    },
  })

  const onSubmit = async (data: CreateMarketFormData) => {
    try {
      setStatus('loading')
      setMessage('Creating market...')

      // Calculate resolution block number (not timestamp!)
      // For local/anvil: ~12 blocks per second
      const BLOCKS_PER_SECOND = 12
      const secondsPerDay = 86400
      const blocksToAdd = BigInt(parseInt(data.resolution) * BLOCKS_PER_SECOND * secondsPerDay)
      const resolutionBlock = (currentBlock || BigInt(10)) + blocksToAdd
      const condition = BigInt(data.condition)

      // Use MockToken instead of Address 0 to avoid validation issues
      const tokenAddress = CONTRACT_ADDRESSES.MockToken

      await createMarket.mutateAsync({
        description: data.description,
        tokenAddress,
        resolutionBlock,
        condition,
        chainId: 31337
      })

      setStatus('success')
      setMessage('✅ Market created successfully!')
      reset()
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create market'}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <GlassCard>
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-mono tracking-tight">
                <Sparkles className="text-cyan-400" size={24} />
                LAUNCH_NEW_MARKET
              </h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Protocol Deployment Layer V1</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">Awaiting Specification</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                Market Narrative
              </Label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' },
                })}
                placeholder="Will the ETH total market cap exceed $600B by year end?"
                className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none h-32 font-mono text-sm leading-relaxed"
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1 font-mono">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="resolution" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                  Duration (Days)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    {...register('resolution', { required: 'Resolution is required' })}
                    className="bg-slate-900/50 border-white/10 rounded-xl py-6 pl-5 pr-12 focus:border-cyan-500/50 transition-all text-white font-mono h-auto"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">DAYS</div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="condition" className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                  Target Condition
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    {...register('condition', { required: 'Condition is required' })}
                    className="bg-slate-900/50 border-white/10 rounded-xl py-6 pl-5 pr-12 focus:border-cyan-500/50 transition-all text-white font-mono h-auto"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">VALUE</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mb-8 p-4 rounded-xl border flex items-start gap-4 ${status === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                    status === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
                      'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                    }`}
                >
                  {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{status === 'loading' ? 'Processing...' : status}</p>
                    <p className="text-xs font-mono">{message}</p>
                  </div>
                </motion.div>
              )}

              <NeonButton
                disabled={status === 'loading'}
                className="w-full py-7 font-bold tracking-[0.3em]"
                type="submit"
              >
                {status === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>SYNCHRONIZING_CORE...</span>
                  </div>
                ) : (
                  'INITIALIZE_MARKET'
                )}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      </div>

      <div className="space-y-8">
        <GlassCard className="border-cyan-500/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-mono">
            <Info size={14} className="text-cyan-400" /> GUIDELINES
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tight">Resolution Logic</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">The system converts days into future block heights. Local: ~12 blocks/sec.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tight">Oracle Protocol</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">Creation is decentralized. Verification occurs on-chain via signed message or logic state.</p>
            </div>
          </div>
        </GlassCard>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent border border-white/5 space-y-4">
          <h4 className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Protocol Metrics</h4>
          <div className="flex justify-between items-end">
            <span className="text-[8px] text-slate-700 font-mono uppercase">Current Block Range</span>
            <span className="text-xs text-slate-400 font-mono">#{currentBlock?.toString() || '---'}</span>
          </div>
          <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full bg-cyan-500/30"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
