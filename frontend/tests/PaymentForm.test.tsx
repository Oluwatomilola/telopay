import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentForm } from '@/components/payment-form'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
  useChainId: () => 8453,
  useBalance: vi.fn(),
  usePrepareTelopayPayETH: () => ({
    config: {},
    write: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useTelopayPayETH: () => ({
    write: vi.fn(),
    data: null,
    error: null,
    isLoading: false,
  }),
  usePrepareTelopayPayUSDC: () => ({
    config: {},
    write: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useTelopayPayUSDC: () => ({
    write: vi.fn(),
    data: null,
    error: null,
    isLoading: false,
  }),
}))

// Mock the TransactionStatus component
vi.mock('@/components/transaction-status', () => ({
  TransactionStatus: () => <div data-testid="transaction-status">Transaction Status</div>,
}))

describe('PaymentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders payment form correctly', () => {
    render(<PaymentForm />)
    
    expect(screen.getByText('Select Token')).toBeInTheDocument()
    expect(screen.getByText('Amount (ETH)')).toBeInTheDocument()
    expect(screen.getByText('Quick Amounts')).toBeInTheDocument()
    expect(screen.getByText('Transaction Details')).toBeInTheDocument()
  })

  it('allows switching between ETH and USDC', () => {
    render(<PaymentForm />)
    
    const usdcButton = screen.getByText('USDC')
    fireEvent.click(usdcButton)
    
    expect(screen.getByText('Amount (USDC)')).toBeInTheDocument()
  })

  it('validates amount input', async () => {
    render(<PaymentForm />)
    
    const amountInput = screen.getByPlaceholderText(/Enter amount/)
    fireEvent.change(amountInput, { target: { value: '0' } })
    
    await waitFor(() => {
      expect(screen.getByText(/Minimum amount/)).toBeInTheDocument()
    })
  })

  it('handles quick amount selection', () => {
    render(<PaymentForm />)
    
    const quickAmountButton = screen.getByText('0.001 ETH')
    fireEvent.click(quickAmountButton)
    
    expect(amountInput.value).toBe('0.001')
  })

  it('disables submit button when form is invalid', () => {
    render(<PaymentForm />)
    
    const submitButton = screen.getByText(/Pay 0 ETH/)
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when valid amount is entered', async () => {
    render(<PaymentForm />)
    
    const amountInput = screen.getByPlaceholderText(/Enter amount/)
    fireEvent.change(amountInput, { target: { value: '0.001' } })
    
    await waitFor(() => {
      const submitButton = screen.getByText(/Pay 0.001 ETH/)
      expect(submitButton).not.toBeDisabled()
    })
  })
})