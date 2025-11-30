'use client'

import { WalletButton } from '@/components/wallet-button'

export function WalletConnectPrompt() {
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            You need to connect your wallet to make payments on Telopay. 
            We support WalletConnect and all major Ethereum wallets.
          </p>
          
          <div className="mb-8">
            <WalletButton />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Fast</h3>
              <p className="text-gray-600">Quick connection and transactions</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Secure</h3>
              <p className="text-gray-600">Your keys, your crypto</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Low Fees</h3>
              <p className="text-gray-600">Powered by Base network</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Supported Wallets</h4>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-700">
              <span className="bg-blue-100 px-2 py-1 rounded">MetaMask</span>
              <span className="bg-blue-100 px-2 py-1 rounded">WalletConnect</span>
              <span className="bg-blue-100 px-2 py-1 rounded">Coinbase Wallet</span>
              <span className="bg-blue-100 px-2 py-1 rounded">Phantom</span>
              <span className="bg-blue-100 px-2 py-1 rounded">Trust Wallet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}