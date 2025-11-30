'use client'

import { useState, useEffect } from 'react'
import { createWeb3Modal, defaultWagmiConfig } from '@reown/appkit-wagmi-react'
import { mainnet, base, baseSepolia } from 'viem/chains'
import { useWeb3Modal } from '@reown/appkit-wagmi-react'

// Networks
const chains = [base, baseSepolia]
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo'

const metadata = {
  name: 'Telopay',
  description: 'Micro-payments for Web3 on Base network',
  url: 'https://telopay.app',
  icons: ['https://telopay.app/icon.png']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// Initialize Web3Modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export function WalletButton() {
  const [address, setAddress] = useState<string>()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { open } = useWeb3Modal()

  useEffect(() => {
    // Check connection status on mount
    if (typeof window !== 'undefined') {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum?.request({ 
            method: 'eth_accounts' 
          })
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.log('No wallet connected')
        }
      }
      
      checkConnection()
      
      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          } else {
            setAddress(undefined)
            setIsConnected(false)
          }
        })
      }
    }
  }, [])

  const handleConnect = () => {
    setIsConnecting(true)
    open()
    setIsConnecting(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-sm text-gray-600">
          {formatAddress(address)}
        </div>
        <button
          onClick={() => open()}
          className="btn-secondary text-sm"
        >
          Connected
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="btn-primary"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}