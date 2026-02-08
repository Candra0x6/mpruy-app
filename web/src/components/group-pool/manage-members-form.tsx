'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGroupPool } from '@/hooks/useGroupPool'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle, Loader, Users } from 'lucide-react'

interface ManageMembersFormProps {
    poolId: bigint
}

interface AddMemberFormData {
    memberAddress: `0x${string}`
}

export function ManageMembersForm({ poolId }: ManageMembersFormProps) {
    const { addMember, getMemberCount } = useGroupPool()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [memberCount, setMemberCount] = useState(0)
    const [isLoadingMembers, setIsLoadingMembers] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AddMemberFormData>({
        defaultValues: {
            memberAddress: '0x' as `0x${string}`,
        },
    })

    // Load member count
    React.useEffect(() => {
        const loadMemberCount = async () => {
            try {
                setIsLoadingMembers(true)
                const count = await getMemberCount(poolId)
                setMemberCount(Number(count) || 0)
            } catch (error) {
                console.error('Failed to load member count:', error)
            } finally {
                setIsLoadingMembers(false)
            }
        }

        loadMemberCount()
    }, [poolId, getMemberCount])

    const onSubmit = async (data: AddMemberFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            await addMember.mutateAsync({
                poolId,
                member: data.memberAddress,
            })

            setStatus('success')
            setMessage(`Member added successfully!`)
            reset()

            // Refresh member count
            const newCount = await getMemberCount(poolId)
            setMemberCount(Number(newCount) || 0)

            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to add member')
        }
    }

    return (
        <div className="space-y-6">
            {/* Member Stats */}
            {isLoadingMembers ? (
                <Skeleton className="h-16 bg-slate-800" />
            ) : (
                <Card className="border-slate-700 bg-slate-800">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <Users className="text-blue-500" size={32} />
                        <div>
                            <p className="text-xs text-slate-500">Total Members</p>
                            <p className="text-3xl font-bold text-white">{memberCount}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add Member Form */}
            <Card className="border-slate-700 bg-slate-900">
                <CardHeader>
                    <CardTitle className="text-lg">Add New Member</CardTitle>
                    <CardDescription>
                        Grant a new member access to this pool
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Member Address */}
                        <div>
                            <Label htmlFor="memberAddress" className="text-slate-200 mb-2 block">
                                Member Wallet Address
                            </Label>
                            <Input
                                id="memberAddress"
                                placeholder="0x..."
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm"
                                {...register('memberAddress', {
                                    required: 'Member address is required',
                                    pattern: {
                                        value: /^0x[a-fA-F0-9]{40}$/,
                                        message: 'Invalid Ethereum address',
                                    },
                                })}
                            />
                            {errors.memberAddress && (
                                <p className="text-red-500 text-sm mt-1">{errors.memberAddress.message}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                This address will be able to deposit and manage pool funds
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
                            {status === 'loading' ? 'Adding Member...' : 'Add Member'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Member Guidelines */}
            <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                    <CardTitle className="text-base">Member Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Members can deposit ETH or tokens into the pool</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Pool managers (MultiSig owners) approve betting proposals</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Winnings are distributed proportionally to contributions</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Only one admin (owner) can add/remove members</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
