import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function getConfig() {
  // Use Sepolia testnet or fall back to localhost if NEXT_PUBLIC_RPC_URL is set
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  
  return createConfig({
    chains: [sepolia],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [sepolia.id]: http(rpcUrl),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}