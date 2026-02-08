import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  useReadGroupPoolGetPool,
  useReadGroupPoolGetMemberCount,
  useWriteGroupPoolCreatePool,
  useWriteGroupPoolDepositEth,
  useWriteGroupPoolAddMember
} from '../abi/generated'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import { useAccount } from 'wagmi'

export function useGroupPool() {
  const { address: userAddress } = useAccount()
  const queryClient = useQueryClient()

  // --- Read Queries ---

  const getPool = (poolId: bigint) => {
    return useReadGroupPoolGetPool({
      address: CONTRACT_ADDRESSES.GroupPool,
      args: [poolId],
    })
  }

  const getMemberCount = (poolId: bigint) => {
    return useReadGroupPoolGetMemberCount({
      address: CONTRACT_ADDRESSES.GroupPool,
      args: [poolId],
    })
  }

  // --- Write Mutations ---

  // Create Pool Mutation
  const { 
    writeContract: createPoolWrite, 
  } = useWriteGroupPoolCreatePool()

  const createPoolMutation = useMutation({
    mutationFn: async (params: { name: string; multiSig: `0x${string}`; token: `0x${string}` }) => {
      return new Promise((resolve, reject) => {
        createPoolWrite(
          {
            address: CONTRACT_ADDRESSES.GroupPool,
            args: [params.name, params.multiSig, params.token],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
  })

  // Deposit ETH Mutation
  const {
    writeContract: depositEthWrite,
  } = useWriteGroupPoolDepositEth()

  const depositEthMutation = useMutation({
    mutationFn: async (params: { poolId: bigint; amount: bigint }) => {
      return new Promise((resolve, reject) => {
        depositEthWrite(
          {
            address: CONTRACT_ADDRESSES.GroupPool,
            args: [params.poolId],
            value: params.amount,
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
  })

  // Add Member Mutation
  const {
    writeContract: addMemberWrite,
  } = useWriteGroupPoolAddMember()

  const addMemberMutation = useMutation({
    mutationFn: async (params: { poolId: bigint; member: `0x${string}` }) => {
      return new Promise((resolve, reject) => {
        addMemberWrite(
          {
            address: CONTRACT_ADDRESSES.GroupPool,
            args: [params.poolId, params.member],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poolMembers'] })
    },
  })

  return {
    userAddress,
    // Queries
    getPool,
    getMemberCount,
    // Mutations
    createPool: createPoolMutation,
    depositEth: depositEthMutation,
    addMember: addMemberMutation,
  }
}
