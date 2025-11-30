import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import type { TelopayPayment, PaymentLimits, ContractBalance } from '@/types/contract'

// Contract ABI for Telopay
export const telopayAbi = parseAbi([
  'function payETH() payable',
  'function payUSDC(uint256 amount)',
  'function getBalance() view returns (uint256 ethBalance, uint256 usdcBalance)',
  'function getPayment(bytes32 paymentId) view returns (tuple(address payer, uint256 amount, bool isEth, uint256 timestamp, bool processed))',
  'function MIN_ETH_PAYMENT() view returns (uint256)',
  'function MIN_USDC_PAYMENT() view returns (uint256)',
  'function MAX_ETH_PAYMENT() view returns (uint256)',
  'function MAX_USDC_PAYMENT() view returns (uint256)',
  'event PaymentReceived(address indexed payer, uint256 amount, bool isEth, bytes32 indexed paymentId, uint256 timestamp)',
  'event Withdrawal(address indexed owner, uint256 ethAmount, uint256 usdcAmount, uint256 timestamp)',
])

// Hook for reading contract data
export function useTelopayContractData(contractAddress: `0x${string}`) {
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'getBalance',
    query: { enabled: !!contractAddress }
  })

  const { data: minEthPayment, isLoading: isLoadingMinEth } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'MIN_ETH_PAYMENT',
    query: { enabled: !!contractAddress }
  })

  const { data: minUsdcPayment, isLoading: isLoadingMinUsdc } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'MIN_USDC_PAYMENT',
    query: { enabled: !!contractAddress }
  })

  const { data: maxEthPayment, isLoading: isLoadingMaxEth } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'MAX_ETH_PAYMENT',
    query: { enabled: !!contractAddress }
  })

  const { data: maxUsdcPayment, isLoading: isLoadingMaxUsdc } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'MAX_USDC_PAYMENT',
    query: { enabled: !!contractAddress }
  })

  return {
    balance: balance as [bigint, bigint] | undefined,
    minEthPayment: minEthPayment as bigint | undefined,
    minUsdcPayment: minUsdcPayment as bigint | undefined,
    maxEthPayment: maxEthPayment as bigint | undefined,
    maxUsdcPayment: maxUsdcPayment as bigint | undefined,
    isLoading: isLoadingBalance || isLoadingMinEth || isLoadingMinUsdc || isLoadingMaxEth || isLoadingMaxUsdc
  }
}

// Hook for ETH payment preparation
export function usePrepareTelopayPayETH({
  value,
  enabled,
  contractAddress
}: {
  value?: bigint
  enabled?: boolean
  contractAddress?: `0x${string}`
}) {
  const { writeContract, error, isPending } = useWriteContract()

  const config = {
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'payETH',
    value,
    query: { enabled: !!enabled && !!value && !!contractAddress }
  }

  return {
    config,
    write: writeContract,
    isLoading: isPending,
    error
  }
}

// Hook for USDC payment preparation  
export function usePrepareTelopayPayUSDC({
  amount,
  enabled,
  contractAddress,
  usdcContract
}: {
  amount?: bigint
  enabled?: boolean
  contractAddress?: `0x${string}`
  usdcContract?: `0x${string}`
}) {
  const { writeContract, error, isPending } = useWriteContract()

  const config = {
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'payUSDC',
    args: [amount],
    query: { enabled: !!enabled && !!amount && !!contractAddress }
  }

  return {
    config,
    write: writeContract,
    isLoading: isPending,
    error
  }
}

// Hook for executing ETH payment
export function useTelopayPayETH(config: any) {
  const { write, data, error, isLoading } = useWriteContract(config)
  return { write, data, error, isLoading }
}

// Hook for executing USDC payment  
export function useTelopayPayUSDC(config: any) {
  const { write, data, error, isLoading } = useWriteContract(config)
  return { write, data, error, isLoading }
}

// Hook for reading specific payment data
export function useTelopayPayment(contractAddress: `0x${string}`, paymentId: `0x${string}`) {
  const { data: payment, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: telopayAbi,
    functionName: 'getPayment',
    args: [paymentId],
    query: { enabled: !!contractAddress && !!paymentId }
  })

  return {
    payment: payment as {
      payer: `0x${string}`
      amount: bigint
      isEth: boolean
      timestamp: bigint
      processed: boolean
    } | undefined,
    isLoading,
    error
  }
}