'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMultiSigWallet } from '@/hooks/useMultiSigWallet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, Loader, Info, Send, Code, Coins } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { NeonButton } from '@/components/ui/neon-button'
import { motion, AnimatePresence } from 'framer-motion'

interface SubmitTxFormData {
  targetAddress: `0x${string}`
  amount: string
  data: string
  description: string
}

export function SubmitTransactionForm() {
  const { submitTransaction } = useMultiSigWallet()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [txMode, setTxMode] = useState<'eth' | 'contract'>('eth')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitTxFormData>({
    defaultValues: {
      targetAddress: '0x' as `0x${string}`,
      amount: '0',
      data: '0x',
      description: '',
    },
  })

  const onSubmitETH = async (data: SubmitTxFormData) => {
    try {
      setStatus('loading')
      setMessage('')

      await submitTransaction.mutateAsync({
        to: data.targetAddress,
        value: BigInt(parseFloat(data.amount) * 1e18),
        data: '0x',
      })

      setStatus('success')
      setMessage('Transaction proposal submitted successfully!')
      reset()
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to submit transaction')
    }
  }

  const onSubmitContract = async (data: SubmitTxFormData) => {
    try {
      setStatus('loading')
      setMessage('')

      await submitTransaction.mutateAsync({
        to: data.targetAddress,
        value: BigInt(0),
        data: data.data as `0x${string}`,
      })

      setStatus('success')
      setMessage('Transaction proposal submitted successfully!')
      reset()
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to submit transaction')
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard className="border-cyan-500/10">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
          <Send className="text-cyan-400" size={20} />
          <h3 className="text-xl font-bold text-white font-mono tracking-tight">PROPOSE TRANSACTION</h3>
        </div>

        <Tabs value={txMode} onValueChange={(val) => setTxMode(val as 'eth' | 'contract')}>
          <TabsList className="grid grid-cols-2 p-1 bg-slate-800/50 border border-white/5 rounded-xl mb-8">
            <TabsTrigger
              value="eth"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all"
            >
              <Coins size={16} />
              ETH Transfer
            </TabsTrigger>
            <TabsTrigger
              value="contract"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all"
            >
              <Code size={16} />
              Contract Call
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={txMode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit(txMode === 'eth' ? onSubmitETH : onSubmitContract)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                      Recipient / Target Address
                    </Label>
                    <Input
                      {...register('targetAddress', { required: 'Address is required' })}
                      placeholder="0x..."
                      className="bg-slate-900/50 border-white/10 text-white focus:border-cyan-500/50 transition-all font-mono"
                    />
                    {errors.targetAddress && (
                      <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.targetAddress.message}
                      </p>
                    )}
                  </div>

                  {txMode === 'eth' ? (
                    <div className="space-y-2">
                      <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                        Amount (ETH)
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        {...register('amount', { required: 'Amount is required' })}
                        className="bg-slate-900/50 border-white/10 text-white focus:border-cyan-500/50 transition-all font-mono"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                        Calldata (HEX)
                      </Label>
                      <textarea
                        {...register('data', { required: 'Hex data is required' })}
                        rows={4}
                        placeholder="0x..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">
                      Transaction Description
                    </Label>
                    <Input
                      {...register('description')}
                      placeholder="Optional purpose for this TX..."
                      className="bg-slate-900/50 border-white/10 text-white focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    {message}
                  </div>
                )}

                {status === 'success' && (
                  <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs flex items-center gap-2">
                    <CheckCircle size={14} />
                    {message}
                  </div>
                )}

                <NeonButton
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-6 font-bold tracking-widest text-sm"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      PROCESSING PROPOSAL...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      SUBMIT FOR CONFIRMATION
                    </>
                  )}
                </NeonButton>
              </form>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </GlassCard>

      <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
        <Info className="text-cyan-400 flex-shrink-0" size={18} />
        <p className="text-xs text-slate-400 leading-relaxed">
          Submitting a proposal will create a new transaction record in the smart contract.
          It will require <span className="text-cyan-400 font-bold">Quorum</span> of owners to sign before it can be executed.
        </p>
      </div>
    </div>
  )
}
