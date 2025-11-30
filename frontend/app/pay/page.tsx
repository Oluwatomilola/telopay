'use client'

import { useState } from 'react'
import { PaymentForm } from '@/components/payment-form'
import { WalletConnectPrompt } from '@/components/wallet-connect-prompt'
import { useAccount } from 'wagmi'

export default function PayPage() {
  const { address, isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'USDC'>('ETH')
  const [amount, setAmount] = useState<string>('')

  if (!isConnected) {
    return <WalletConnectPrompt />
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Payment
          </h1>
          <p className="text-lg text-gray-600">
            Pay with ETH or USDC on Base network to access content or services
          </p>
        </div>

        {/* Payment Form */}
        <div className="card p-8">
          <PaymentForm />
        </div>

        {/* Payment Limits */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Payment Limits
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">ETH Payments</h4>
              <p className="text-gray-600">
                Minimum: 0.0001 ETH (0.1 mETH)<br />
                Maximum: 10 ETH
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">USDC Payments</h4>
              <p className="text-gray-600">
                Minimum: 1 USDC<br />
                Maximum: 1,000,000 USDC
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Limits help prevent spam and ensure fair usage of the platform.
          </p>
        </div>

        {/* Network Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">
              Powered by Base Network
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}