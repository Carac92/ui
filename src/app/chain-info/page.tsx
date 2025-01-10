'use client'

import React, { useState, useEffect } from 'react'
import {useAccount, useBlockNumber, useEstimateFeesPerGas, usePublicClient} from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { formatEther, formatUnits } from 'viem'

export default function ChainInfoPage() {
    const { chain } = useAccount()
    const { data: blockNumber } = useBlockNumber()
    const { data:result } = useEstimateFeesPerGas()
    const publicClient = usePublicClient()

    const [blockHash, setBlockHash] = useState<string | null>(null)
    const [gasUsed, setGasUsed] = useState<bigint | null>(null)
    const [baseFeePerGas, setBaseFeePerGas] = useState<bigint | null>(null)

    useEffect(() => {
        async function fetchBlock() {
            if (!blockNumber || !publicClient) return
            const block = await publicClient.getBlock({blockNumber})
            if (block) {
                setBlockHash(block.hash)
                setGasUsed(block.gasUsed)
                setBaseFeePerGas(block.baseFeePerGas ?? null)
            }
        }
        fetchBlock()
    }, [blockNumber, publicClient])

    // Gas price en Gwei
    const gasPriceWei = result?.gasPrice
    const gasPriceGwei = gasPriceWei ? formatUnits(gasPriceWei, 9) : null
    console.log(result)
    // Burnt fees = baseFeePerGas * gasUsed
    let burntFeesEther: string | null = null
    if (baseFeePerGas && gasUsed) {
        const burntWei = baseFeePerGas * gasUsed
        burntFeesEther = formatEther(burntWei)
    }

    // Gestion d'erreur : si pas sur mainnet ou sepolia
    const isSupportedChain = chain?.id === mainnet.id || chain?.id === sepolia.id

    return (
        <div style={{ padding: 24 }}>
            <h1>Chain Info</h1>

            {!isSupportedChain && (
                <div style={{ background: '#fdd', color: '#900', padding: '8px', marginBottom: '12px' }}>
                    <strong>Error:</strong> You are on an unsupported chain (ID: {chain}).
                    Please switch to Mainnet or Sepolia via the Header.
                </div>
            )}

            <p><strong>Chain ID:</strong> {chain?.id ?? 'Not connected'}</p>
            <p><strong>Last block number:</strong> {blockNumber ?? 'Loading...'}</p>
            <p><strong>Latest block hash:</strong> {blockHash ?? 'Loading...'}</p>
            <p><strong>Gas used:</strong> {gasUsed?.toString() ?? 'Loading...'}</p>
            <p><strong>Gas price (Gwei):</strong> {gasPriceGwei ?? 'Loading...'}</p>
            <p><strong>Burnt fees (ETH):</strong> {burntFeesEther ?? 'Loading...'}</p>
        </div>
    )
}
