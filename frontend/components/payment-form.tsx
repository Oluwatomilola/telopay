'use client'

import { useState } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { parseUnits } from 'viem'
import { 
  usePrepareTelopayPayETH, 
  useTelopayPayETH,
  usePrepareTelopayPayUSDC,
  useTelopayPayUSDC 
} from '@/hooks/useTelopayContract'
import { TransactionStatus } from '@/components/transaction-status'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TELOPAY_CONTRACT || '0x...'
const USDC_CONTRACT = process.env.NEXT_PUBLIC_USDC_CONTRACT_BASE || '0x...'

export function PaymentForm() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'USDC'>('ETH')
  const [amount, setAmount] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Get token contract based on network
  const usdcContract = chainId === 84532 
    ? (process.env.NEXT_PUBLIC_USDC_CONTRACT_SEPOLIA || '0x...')
    : USDC_CONTRACT

  // Balance queries
  const { data: ethBalance } = useBalance({
    address,
    query: { enabled: !!address }
  })

  const { data: usdcBalance } = useBalance({
    address,
    token: usdcContract as `0x${string}`,
    query: { enabled: !!address && selectedToken === 'USDC' }
  })

  // Contract preparation for ETH payment
  const { config: ethConfig, error: ethError } = usePrepareTelopayPayETH({
    value: amount ? parseUnits(amount, 18) : undefined,
    enabled: !!amount && selectedToken === 'ETH',
    contractAddress: CONTRACT_ADDRESS as `0x${string}`,
  })

  const { write: writeETH, data: ethData, error: ethWriteError } = useTelopayPayETH(ethConfig)

  // Contract preparation for USDC payment
  const { config: usdcConfig, error: usdcError } = usePrepareTelopayPayUSDC({
    amount: amount ? parseUnits(amount, 6) : undefined,
    enabled: !!amount && selectedToken === 'USDC',
    contractAddress: CONTRACT_ADDRESS as `0x${string}`,
    usdcContract: usdcContract as `0x${string}`,
  })

  const { write: writeUSDC, data: usdcData, error: usdcWriteError } = useTelopayPayUSDC(usdcConfig)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)

    try {
      if (selectedToken === 'ETH') {
        writeETH?.()
      } else {
        writeUSDC?.()
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const getMinAmount = () => selectedToken === 'ETH' ? '0.0001' : '1'
  const getMaxAmount = () => selectedToken === 'ETH' ? '10' : '1000000'
  
  const formatBalance = (balance: any) => {
    if (!balance) return '0'
    return Number(balance.formatted).toFixed(6)
  }

  const isBalanceInsufficient = () => {
    if (!amount || !address) return false
    const amountNum = parseFloat(amount)
    
    if (selectedToken === 'ETH') {
      return ethBalance ? amountNum > parseFloat(ethBalance.formatted) : false
    } else {
      return usdcBalance ? amountNum > parseFloat(usdcBalance.formatted) : false
    }
  }

  const getErrorMessage = () => {
    if (isBalanceInsufficient()) return 'Insufficient balance'
    if (amount && parseFloat(amount) < parseFloat(getMinAmount())) {
      return `Minimum amount is ${getMinAmount()} ${selectedToken}`
    }
    if (amount && parseFloat(amount) > parseFloat(getMaxAmount())) {
      return `Maximum amount is ${getMaxAmount()} ${selectedToken}`
    }
    if (ethError || usdcError) return 'Contract configuration error'
    if (ethWriteError || usdcWriteError) return 'Transaction failed'
    return null
  }

  const errorMessage = getErrorMessage()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Token Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Token
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedToken('ETH')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedToken === 'ETH'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">Ξ</div>
              <div className="font-medium">ETH</div>
              <div className="text-sm text-gray-500">
                Balance: {formatBalance(ethBalance)} ETH
              </div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedToken('USDC')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedToken === 'USDC'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1 font-bold">$</div>
              <div className="font-medium">USDC</div>
              <div className="text-sm text-gray-500">
                Balance: {formatBalance(usdcBalance)} USDC
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount ({selectedToken})
        </label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Enter amount (${getMinAmount()} - ${getMaxAmount()})`}
            className={`input w-full pr-12 ${
              errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isProcessing}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 text-sm font-medium">
              {selectedToken}
            </span>
          </div>
        </div>
        
        {/* Amount Range Hints */}
        <div className="mt-2 text-xs text-gray-500">
          Range: {getMinAmount()} - {getMaxAmount()} {selectedToken}
        </div>
        
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Amounts
        </label>
        <div className="grid grid-cols-4 gap-2">
          {selectedToken === 'ETH' ? (
            ['0.001', '0.01', '0.1', '1'].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                {quickAmount} ETH
              </button>
            ))
          ) : (
            ['1', '10', '100', '1000'].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                ${quickAmount}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Transaction Fee Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span>{amount || '0'} {selectedToken}</span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span>Base</span>
          </div>
          <div className="flex justify-between">
            <span>Contract:</span>
            <span className="font-mono text-xs">
              {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          !amount || 
          parseFloat(amount) <= 0 ||
          isBalanceInsufficient() ||
          isProcessing ||
          !!errorMessage
        }
        className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay ${amount || '0'} ${selectedToken}`}
      </button>

      {/* Transaction Status */}
      {(ethData?.hash || usdcData?.hash) && (
        <TransactionStatus 
          hash={ethData?.hash || usdcData?.hash} 
          onComplete={() => setIsProcessing(false)}
        />
      )}
    </form>
  )
}