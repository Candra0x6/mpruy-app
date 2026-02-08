import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  useReadMultiSigWalletGetWalletDetails,
  useReadMultiSigWalletGetTransaction,
  useReadMultiSigWalletGetOwners,
  useWriteMultiSigWalletSubmitTransaction,
  useWriteMultiSigWalletConfirmTransaction,
  useWriteMultiSigWalletExecuteTransaction,
  useWriteMultiSigWalletRevokeConfirmation
} from '../abi/generated'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import { useAccount } from 'wagmi'

export function useMultiSigWallet() {
  const { address: userAddress } = useAccount()
  const queryClient = useQueryClient()

  // --- Read Queries ---

  const walletDetails = useReadMultiSigWalletGetWalletDetails({
    address: CONTRACT_ADDRESSES.MultiSigWallet,
  })

  const owners = useReadMultiSigWalletGetOwners({
    address: CONTRACT_ADDRESSES.MultiSigWallet,
  })

  const getTransaction = (txId: bigint) => {
    return useReadMultiSigWalletGetTransaction({
      address: CONTRACT_ADDRESSES.MultiSigWallet,
      args: [txId],
    })
  }

  // --- Write Mutations ---

  const { writeContract: submitTransactionWrite } = useWriteMultiSigWalletSubmitTransaction()
  const submitTransactionMutation = useMutation({
    mutationFn: async (params: { to: `0x${string}`; value: bigint; data: `0x${string}` }) => {
      return new Promise((resolve, reject) => {
        submitTransactionWrite(
          {
            address: CONTRACT_ADDRESSES.MultiSigWallet,
            args: [params.to, params.value, params.data],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const { writeContract: confirmTransactionWrite } = useWriteMultiSigWalletConfirmTransaction()
  const confirmTransactionMutation = useMutation({
    mutationFn: async (txId: bigint) => {
      return new Promise((resolve, reject) => {
        confirmTransactionWrite(
          {
            address: CONTRACT_ADDRESSES.MultiSigWallet,
            args: [txId],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const { writeContract: executeTransactionWrite } = useWriteMultiSigWalletExecuteTransaction()
  const executeTransactionMutation = useMutation({
    mutationFn: async (txId: bigint) => {
      return new Promise((resolve, reject) => {
        executeTransactionWrite(
          {
            address: CONTRACT_ADDRESSES.MultiSigWallet,
            args: [txId],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const { writeContract: revokeConfirmationWrite } = useWriteMultiSigWalletRevokeConfirmation()
  const revokeConfirmationMutation = useMutation({
    mutationFn: async (txId: bigint) => {
      return new Promise((resolve, reject) => {
        revokeConfirmationWrite(
          {
            address: CONTRACT_ADDRESSES.MultiSigWallet,
            args: [txId],
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        )
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    userAddress,
    // Queries
    walletDetails,
    owners,
    getTransaction,
    // Mutations
    submitTransaction: submitTransactionMutation,
    confirmTransaction: confirmTransactionMutation,
    executeTransaction: executeTransactionMutation,
    revokeConfirmation: revokeConfirmationMutation,
  }
}
