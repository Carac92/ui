import { createConfig, createStorage, cookieStorage } from 'wagmi'
import { mainnet, sepolia} from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { http } from 'wagmi'

/**
 * Crée la configuration wagmi.
 * SSR = true pour hydrater depuis les cookies (storage = cookieStorage).
 */
export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      }),
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
}

// Déclaration du Register (si besoin de type sur config)
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
