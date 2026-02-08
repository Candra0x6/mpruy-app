'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGroupPool } from '@/hooks/useGroupPool'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { parseEther } from 'viem'

interface DepositFundsFormProps {
    poolId: bigint
}

interface DepositFormData {
    amount: string
}

export function DepositFundsForm({ poolId }: DepositFundsFormProps) {
    const { depositEth, getPool } = useGroupPool()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [depositType, setDepositType] = useState<'eth' | 'token'>('eth')
    const [poolData, setPoolData] = useState<any>(null)
    const [isLoadingPoolData, setIsLoadingPoolData] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DepositFormData>({
        defaultValues: {
            amount: '',
        },
    })

    // Load pool data
    React.useEffect(() => {
        const loadPoolData = async () => {
            try {
                setIsLoadingPoolData(true)
                const pool = getPool(poolId)
                setPoolData(pool)
            } catch (error) {
                console.error('Failed to load pool data:', error)
            } finally {
                setIsLoadingPoolData(false)
            }
        }

        loadPoolData()
    }, [poolId, getPool])

    const onSubmitETH = async (data: DepositFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            const amountInWei = parseEther(data.amount)
            await depositEth.mutateAsync({
                poolId,
                amount: amountInWei,
            })

            setStatus('success')
            setMessage(`Successfully deposited ${data.amount} ETH!`)
            reset()

            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to deposit ETH')
        }
    }

    const onSubmitToken = async (data: DepositFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // TODO: Implement token deposit when contract method is available
            setStatus('error')
            setMessage('Token deposits are coming soon')
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to deposit token')
        }
    }

    if (isLoadingPoolData) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 bg-slate-800" />
                <Skeleton className="h-40 bg-slate-800" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Pool Info Card */}
            <Card className="border-slate-700 bg-slate-800">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Pool ID</p>
                            <p className="text-sm font-mono text-slate-300">{poolId.toString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Current Balance</p>
                            <p className="text-sm text-slate-300">
                                {poolData?.balance ? (Number(poolData.balance) / 1e18).toFixed(4) : '0'} ETH
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deposit Type Tabs */}
            <Tabs value={depositType} onValueChange={(val) => setDepositType(val as 'eth' | 'token')}>
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                    <TabsTrigger value="eth">ETH Deposit</TabsTrigger>
                    <TabsTrigger value="token" disabled>
                        Token Deposit (Coming Soon)
                    </TabsTrigger>
                </TabsList>

                {/* ETH Deposit Tab */}
                <TabsContent value="eth">
                    <form onSubmit={handleSubmit(onSubmitETH)} className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="ethAmount" className="text-slate-200 mb-2 block">
                                ETH Amount
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="ethAmount"
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    placeholder="0.5"
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 flex-1"
                                    {...register('amount', {
                                        required: 'Amount is required',
                                        pattern: {
                                            value: /^\d+\.?\d*$/,
                                            message: 'Invalid amount',
                                        },
                                        validate: (value) => {
                                            const num = parseFloat(value)
                                            return num > 0 || 'Amount must be greater than 0'
                                        },
                                    })}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                                    onClick={() => {
                                        // Quick max deposit button (would need balance from wallet)
                                    }}
                                >
                                    Max
                                </Button>
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                You will share this deposit amount with all pool members
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

                        <Button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                            {status === 'loading' && <Loader className="mr-2 animate-spin" size={18} />}
                            {status === 'loading' ? 'Depositing...' : 'Deposit ETH'}
                        </Button>
                    </form>
                </TabsContent>

                {/* Token Deposit Tab */}
                <TabsContent value="token">
                    <div className="text-center py-8 text-slate-400">
                        <p>Token deposit functionality coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
