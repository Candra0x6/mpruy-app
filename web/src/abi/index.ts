import * as generated from './generated'

export const ABIs = {
  GroupPool: generated.groupPoolAbi,
  MultiSigWallet: generated.multiSigWalletAbi,
  PredictionMarket: generated.predictionMarketAbi,
} as const

export type ContractName = keyof typeof ABIs

/**
 * Get the ABI for a specific contract by name
 * @param name The name of the contract
 * @returns The ABI array
 */
export function getABI(name: ContractName) {
  return ABIs[name]
}

export * from './generated'
