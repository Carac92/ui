'use client'

import { ReactNode, useState } from 'react'
import { WagmiProvider, type State } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getConfig } from '../wagmi'

export function Providers(props: { children: ReactNode; initialState?: State }) {
    // On crée la config wagmi UNE FOIS
    const [config] = useState(() => getConfig())
    // On crée le client React Query
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
