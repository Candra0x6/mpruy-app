'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle, Loader, TrendingUp } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { parseEther } from 'viem'

interface StakeInMarketFormProps {
    poolId: bigint
}

interface StakeFormData {
    marketId: string
    stakeAmount: string
    outcome: 'yes' | 'no'
}

export function StakeInMarketForm({ poolId }: StakeInMarketFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [tab, setTab] = useState('propose')
    const [poolBalance, setPoolBalance] = useState<bigint>(0n)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<StakeFormData>({
        defaultValues: {
            marketId: '',
            stakeAmount: '',
            outcome: 'yes',
        },
    })

    const outcome = watch('outcome')

    const onSubmitProposal = async (data: StakeFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // TODO: Integrate with MultiSigWallet to propose the stake
            // This would involve:
            // 1. Creating a proposal in the MultiSigWallet contract
            // 2. The proposal would call PredictionMarket.placeStake()
            // 3. Once confirmed by required owners, it executes

            setStatus('success')
            setMessage('Stake proposal submitted! Awaiting MultiSig confirmations...')

            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to propose stake')
        }
    }

    return (
        <div className="space-y-6">
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                    <TabsTrigger value="propose">Propose Stake</TabsTrigger>
                    <TabsTrigger value="history">Stake History</TabsTrigger>
                </TabsList>

                {/* Propose Stake Tab */}
                <TabsContent value="propose">
                    <Card className="border-slate-700 bg-slate-900">
                        <CardHeader>
                            <CardTitle>Propose Collective Bet</CardTitle>
                            <CardDescription>
                                Create a proposal to stake the pool's funds in a prediction market
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmitProposal)} className="space-y-6">
                                {/* Market ID */}
                                <div>
                                    <Label htmlFor="marketId" className="text-slate-200 mb-2 block">
                                        Prediction Market ID
                                    </Label>
                                    <Input
                                        id="marketId"
                                        type="number"
                                        placeholder="e.g., 1"
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        {...register('marketId', {
                                            required: 'Market ID is required',
                                        })}
                                    />
                                    {errors.marketId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.marketId.message}</p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-2">
                                        The ID of the prediction market you want to stake in
                                    </p>
                                </div>

                                {/* Outcome Selection */}
                                <div>
                                    <Label className="text-slate-200 mb-3 block">Select Outcome</Label>
                                    <RadioGroup value={outcome} onValueChange={(val) => { }} className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg bg-slate-800 cursor-pointer hover:bg-slate-750">
                                            <RadioGroupItem value="yes" id="outcome-yes" />
                                            <Label htmlFor="outcome-yes" className="cursor-pointer text-slate-200 flex-1">
                                                <span className="font-semibold">Yes</span>
                                                <p className="text-xs text-slate-500 mt-1">Predict the outcome will occur</p>
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg bg-slate-800 cursor-pointer hover:bg-slate-750">
                                            <RadioGroupItem value="no" id="outcome-no" />
                                            <Label htmlFor="outcome-no" className="cursor-pointer text-slate-200 flex-1">
                                                <span className="font-semibold">No</span>
                                                <p className="text-xs text-slate-500 mt-1">Predict the outcome will not occur</p>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Stake Amount */}
                                <div>
                                    <Label htmlFor="stakeAmount" className="text-slate-200 mb-2 block">
                                        Stake Amount (ETH)
                                    </Label>
                                    <Input
                                        id="stakeAmount"
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        placeholder="0.1"
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        {...register('stakeAmount', {
                                            required: 'Stake amount is required',
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
                                    {errors.stakeAmount && (
                                        <p className="text-red-500 text-sm mt-1">{errors.stakeAmount.message}</p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-2">
                                        Available pool balance: {(Number(poolBalance) / 1e18).toFixed(4)} ETH
                                    </p>
                                </div>

                                {/* Flow Explanation */}
                                <Card className="border-blue-500/30 bg-blue-950/20">
                                    <CardContent className="pt-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-blue-300 font-semibold">How this works:</p>
                                            <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                                                <li>You create a proposal with the market ID and amount</li>
                                                <li>MultiSig owners receive the proposal for confirmation</li>
                                                <li>Once enough owners confirm, the stake is executed</li>
                                                <li>The pool's funds participate in the prediction market</li>
                                            </ol>
                                        </div>
                                    </CardContent>
                                </Card>

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
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {status === 'loading' && <Loader className="mr-2 animate-spin" size={18} />}
                                    {status === 'loading' ? 'Submitting Proposal...' : 'Submit Stake Proposal'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card className="border-slate-700 bg-slate-900">
                        <CardHeader>
                            <CardTitle>Stake History</CardTitle>
                            <CardDescription>
                                View past stakes and their outcomes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <TrendingUp className="mx-auto mb-4 text-slate-500" size={32} />
                                <p className="text-slate-400 mb-4">No stake history available</p>
                                <p className="text-xs text-slate-500">
                                    Proposed and executed stakes will appear here
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Important Note */}
            <Card className="border-amber-500/30 bg-amber-950/20">
                <CardContent className="pt-4">
                    <p className="text-sm text-amber-300">
                        <span className="font-semibold">⚠ Important:</span> Staking with pool funds requires MultiSig approval.
                        The pool's funds follow the governance decisions of the MultiSig wallet owners.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
