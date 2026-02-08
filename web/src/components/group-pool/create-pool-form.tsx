/**
 * #file:group-pool
 * CreatePoolForm Component
 * 
 * Provides a form interface for creating a new group pool.
 * Handles pool name, multi-signature wallet address, and token address inputs.
 * Manages form submission and displays loading/success/error states.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGroupPool } from '@/hooks/useGroupPool'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

interface CreatePoolFormData {
    poolName: string
    multiSigAddress: `0x${string}`
    tokenAddress: `0x${string}`
}

export function CreatePoolForm() {
    const { createPool } = useGroupPool()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreatePoolFormData>({
        defaultValues: {
            poolName: '',
            multiSigAddress: '0x' as `0x${string}`,
            tokenAddress: '0x' as `0x${string}`,
        },
    })

    const onSubmit = async (data: CreatePoolFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            await createPool.mutateAsync({
                name: data.poolName,
                multiSig: data.multiSigAddress,
                token: data.tokenAddress,
            })

            setStatus('success')
            setMessage('Pool created successfully!')
            reset()

            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to create pool')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Pool Name */}
            <div>
                <Label htmlFor="poolName" className="text-slate-200 mb-2 block">
                    Pool Name
                </Label>
                <Input
                    id="poolName"
                    placeholder="e.g., BTC Price Prediction Pool"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    {...register('poolName', {
                        required: 'Pool name is required',
                        minLength: {
                            value: 3,
                            message: 'Pool name must be at least 3 characters',
                        },
                    })}
                />
                {errors.poolName && (
                    <p className="text-red-500 text-sm mt-1">{errors.poolName.message}</p>
                )}
            </div>

            {/* MultiSig Wallet Address */}
            <div>
                <Label htmlFor="multiSigAddress" className="text-slate-200 mb-2 block">
                    Multi-Signature Wallet Address
                </Label>
                <Input
                    id="multiSigAddress"
                    placeholder="0x..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm"
                    {...register('multiSigAddress', {
                        required: 'MultiSig address is required',
                        pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/,
                            message: 'Invalid Ethereum address',
                        },
                    })}
                />
                {errors.multiSigAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.multiSigAddress.message}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                    The multi-sig wallet that will govern this pool's decisions
                </p>
            </div>

            {/* Token Address */}
            <div>
                <Label htmlFor="tokenAddress" className="text-slate-200 mb-2 block">
                    Token Address (Optional)
                </Label>
                <Input
                    id="tokenAddress"
                    placeholder="0x... (leave empty for ETH only)"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm"
                    {...register('tokenAddress', {
                        pattern: {
                            value: /^(0x[a-fA-F0-9]{40})?$/,
                            message: 'Invalid Ethereum address',
                        },
                    })}
                />
                {errors.tokenAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.tokenAddress.message}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                    Optional ERC-20 token for pool deposits
                </p>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
                <Card className="border-green-500/50 bg-green-950/20">
                    <CardContent className="pt-4 flex items-center gap-2 text-green-500">
                        <CheckCircle size={18} />
                        <span>{message}</span>
                    </CardContent>
                </Card>
            )}

            {status === 'error' && (
                <Card className="border-red-500/50 bg-red-950/20">
                    <CardContent className="pt-4 flex items-center gap-2 text-red-500">
                        <AlertCircle size={18} />
                        <span>{message}</span>
                    </CardContent>
                </Card>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                {status === 'loading' && <Loader className="mr-2 animate-spin" size={18} />}
                {status === 'loading' ? 'Creating Pool...' : 'Create Pool'}
            </Button>
        </form>
    )
}
