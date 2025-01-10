'use client'

import React from 'react'

export default function HomePage() {
  return (
      <div style={{ padding: 24 }}>
        <h2>Welcome to My Wagmi App</h2>
        <p>Use the Header above to connect your wallet or switch networks.</p>
        <p>
          Then visit <a href="/chain-info">/chain-info</a> to see chain data.
        </p>
      </div>
  )
}
