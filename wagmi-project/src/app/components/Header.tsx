'use client'

import { useAccount, useBalance, useDisconnect, useConnect, useSwitchChain } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import React from 'react'
import {shortenAddress} from "@/app/utils/shortenAddress";

export function Header() {
    // Récupérer l'état du compte
    const { status, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: balanceData } = useBalance({ address })
    const { chain } = useAccount()
    const { connectors, connect, error, pendingConnector } = useConnect()
    const { chains, switchChain } = useSwitchChain()
    const isConnected = status === 'connected'
    return (
        <header style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid #ddd' }}>
            <div style={{ fontWeight: 'bold' }}>My Wagmi App</div>

            {/* Boutons de switch de réseau */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {chains.map((chain) => (
                    <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
                        {chain.name}
                    </button>
                ))}
            </div>

            {/* Afficher la chaîne courante */}
            <div style={{ marginLeft: 'auto' }}>
                {chain ? `Chain: ${chain.name} (ID: ${chain.id})` : 'No chain'}
            </div>

            {/* Connect / Disconnect */}
            {!isConnected ? (
                <div>
                    {/* Liste de connecteurs */}
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            disabled={connector.id === pendingConnector?.id}
                        >
                            {connector.name}
                            {connector.id === pendingConnector?.id && ' (connecting)'}
                        </button>
                    ))}
                    {error && <div style={{ color: 'red' }}>{error.message}</div>}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span>Addr: {shortenAddress(address || '')}</span>
                    <span>Balance: {balanceData?.formatted.slice(0, 6)} {balanceData?.symbol}</span>
                    <button onClick={() => disconnect()}>Disconnect</button>
                </div>
            )}
        </header>
    )
}
