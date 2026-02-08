import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/abi/generated.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '../contracts',
      include: [
        'GroupPool.json',
        'MultiSigWallet.json',
        'PredictionMarket.json',
      ],
    }),
    react(),
  ],
})
