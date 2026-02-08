import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  useReadPredictionMarketGetMarket,
  useReadPredictionMarketGetUserStake,
  useReadPredictionMarketGetMarketCount,
  useWritePredictionMarketPlaceStake,
  useWritePredictionMarketWithdrawWinnings,
  useWritePredictionMarketAdminResolveMarket,
  useWritePredictionMarketAutoResolveMarket,
  predictionMarketAbi
} from '../abi/generated'
import { useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import { useAccount } from 'wagmi'

export enum PredictionOutcome {
  Yes = 0,
  No = 1,
  Unresolved = 2
}

export function usePredictionMarket() {
  const { address: userAddress } = useAccount()
  const queryClient = useQueryClient()

  // --- Read Queries ---

  const marketCount = useReadPredictionMarketGetMarketCount({
    address: CONTRACT_ADDRESSES.PredictionMarket,
  })

  const getMarket = (marketId: bigint) => {
    return useReadPredictionMarketGetMarket({
      address: CONTRACT_ADDRESSES.PredictionMarket,
      args: [marketId],
    })
  }

  const getUserStake = (marketId: bigint, stakerAddress?: `0x${string}`) => {
    const targetAddress = stakerAddress || userAddress
    return useReadPredictionMarketGetUserStake({
      address: CONTRACT_ADDRESSES.PredictionMarket,
      args: targetAddress ? [marketId, targetAddress] : undefined,
      query: {
        enabled: !!targetAddress
      }
    })
  }

  // --- Write Mutations ---
const { writeContractAsync } = useWriteContract()

  const createMarketMutation = useMutation({
  mutationFn: async (params: { 
    description: string; 
    tokenAddress: `0x${string}`; 
    resolutionBlock: bigint; 
    condition: bigint 
    chainId: number
  }) => {
    // Use writeContractAsync directly to bypass validation
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.PredictionMarket,
      abi: predictionMarketAbi,
      functionName: 'createMarket',
      args: [
        params.description, 
        params.tokenAddress, 
        params.resolutionBlock, 
        params.condition
      ],
    })
  },
  onSuccess: (hash) => {
    console.log("Transaction Hash:", hash)
    queryClient.invalidateQueries({ queryKey: ['markets'] })
  },
  onError: (error) => {
    console.error("Mutation Error:", error)
  }
})

  const { writeContract: placeStakeWrite } = useWritePredictionMarketPlaceStake()
  const placeStakeMutation = useMutation({
    mutationFn: async (params: { marketId: bigint; outcome: number; amount: bigint; isEth: boolean }) => {
      return new Promise((resolve, reject) => {
        placeStakeWrite(
          {
            address: CONTRACT_ADDRESSES.PredictionMarket,
            args: [params.marketId, params.outcome, params.amount],
            value: params.isEth ? params.amount : undefined,
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets', 'stakes'] })
    },
  })

  const { writeContract: withdrawWinningsWrite } = useWritePredictionMarketWithdrawWinnings()
  const withdrawWinningsMutation = useMutation({
    mutationFn: async (marketId: bigint) => {
      return new Promise((resolve, reject) => {
        withdrawWinningsWrite(
          {
            address: CONTRACT_ADDRESSES.PredictionMarket,
            args: [marketId],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets', 'stakes'] })
    },
  })

  const { writeContract: resolveMarketWrite } = useWritePredictionMarketAdminResolveMarket()
  const resolveMarketMutation = useMutation({
    mutationFn: async (params: { marketId: bigint; outcome: number }) => {
      return new Promise((resolve, reject) => {
        resolveMarketWrite(
          {
            address: CONTRACT_ADDRESSES.PredictionMarket,
            args: [params.marketId, params.outcome],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] })
    },
  })

  return {
    userAddress,
    // Queries
    marketCount,
    getMarket,
    getUserStake,
    // Mutations
    createMarket: createMarketMutation,
    placeStake: placeStakeMutation,
    withdrawWinnings: withdrawWinningsMutation,
    resolveMarket: resolveMarketMutation,
  }
}
