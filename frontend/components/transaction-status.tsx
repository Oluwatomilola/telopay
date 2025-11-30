'use client'

import { useState, useEffect } from 'react'
import { useWaitForTransactionReceipt, useChainId } from 'wagmi'
import Link from 'next/link'

interface TransactionStatusProps {
  hash: `0x${string}`
  onComplete?: () => void
}

export function TransactionStatus({ hash, onComplete }: TransactionStatusProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState<string | null>(null)
  const chainId = useChainId()

  const { isLoading: isConfirming, isSuccess, isError, error: waitError } = useWaitForTransactionReceipt({
    hash,
    confirmations: 2,
  })

  useEffect(() => {
    if (isSuccess) {
      setStatus('success')
      setError(null)
      onComplete?.()
    } else if (isError) {
      setStatus('error')
      setError(waitError?.message || 'Transaction failed')
      onComplete?.()
    }
  }, [isSuccess, isError, waitError, onComplete])

  const getExplorerUrl = () => {
    if (chainId === 84532) {
      return `https://sepolia.basescan.org/tx/${hash}`
    } else if (chainId === 8453) {
      return `https://basescan.org/tx/${hash}`
    }
    return '#'
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  if (status === 'pending') {
    return (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Transaction Pending</h4>
            <p className="text-sm text-yellow-600 mt-1">
              Your payment is being processed...
            </p>
            <p className="text-xs text-yellow-500 mt-1 font-mono">
              {formatHash(hash)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-green-800">Payment Successful!</h4>
            <p className="text-sm text-green-600 mt-1">
              Your payment has been confirmed on the blockchain.
            </p>
            <div className="mt-2 flex items-center space-x-4">
              <Link
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                View on BaseScan →
              </Link>
              <span className="text-xs text-green-600 font-mono">
                {formatHash(hash)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-red-800">Payment Failed</h4>
            <p className="text-sm text-red-600 mt-1">
              {error || 'Your transaction was rejected or failed to process.'}
            </p>
            <div className="mt-2 flex items-center space-x-4">
              <Link
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-700 hover:text-red-800 font-medium"
              >
                View Transaction →
              </Link>
              <span className="text-xs text-red-600 font-mono">
                {formatHash(hash)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}