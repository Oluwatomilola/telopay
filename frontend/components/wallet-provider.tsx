'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

// Configure wagmi and appkit for Base networks
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo'

const metadata = {
  name: 'Telopay',
  description: 'Micro-payments for Web3 on Base network',
  url: 'https://telopay.app',
  icons: ['https://telopay.app/icon.png']
}

// Base Mainnet
const baseMainnet = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
  testnet: false,
}

// Base Sepolia Testnet
const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
}

const networks = [baseMainnet, baseSepolia]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

const queryClient = new QueryClient()

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: [],
    emailShowWallets: false,
  },
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export { modal }