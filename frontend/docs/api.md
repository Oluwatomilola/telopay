# Telopay API Documentation

## Smart Contract Functions

### Core Payment Functions

#### `payETH()`
**Description**: Process an ETH payment for services or content.

**Parameters**: None (uses msg.value)

**Requirements**:
- `msg.value` must be between `MIN_ETH_PAYMENT` (0.0001 ETH) and `MAX_ETH_PAYMENT` (10 ETH)
- Contract must not be paused
- Sender must have sufficient ETH balance

**Events Emitted**: `PaymentReceived`

**Gas Estimate**: ~45,000 gas

**Error Cases**:
- "ETH amount too small" - Payment below minimum
- "ETH amount too large" - Payment above maximum
- Contract paused - Emergency pause active

#### `payUSDC(uint256 amount)`
**Description**: Process a USDC payment for services or content.

**Parameters**:
- `amount`: Amount of USDC to pay (in wei, 6 decimals)

**Requirements**:
- Amount must be between `MIN_USDC_PAYMENT` (1 USDC) and `MAX_USDC_PAYMENT` (1M USDC)
- Contract must not be paused
- Sender must have sufficient USDC allowance
- Sender must have sufficient USDC balance

**Events Emitted**: `PaymentReceived`

**Gas Estimate**: ~85,000 gas

**Error Cases**:
- "Amount must be greater than zero" - Zero amount provided
- "USDC amount too small" - Payment below minimum
- "USDC amount too large" - Payment above maximum
- "Insufficient allowance" - USDC allowance too low
- "Insufficient balance" - USDC balance too low
- "USDC transfer failed" - Transfer from failed

### Administrative Functions

#### `withdrawAll()`
**Description**: Withdraw all accumulated ETH and USDC to owner address.

**Requirements**:
- Only callable by contract owner
- Contract must have non-zero balances

**Events Emitted**: `Withdrawal`

#### `withdraw(uint256 ethAmount, uint256 usdcAmount)`
**Description**: Withdraw specific amounts of ETH and USDC.

**Parameters**:
- `ethAmount`: Amount of ETH to withdraw
- `usdcAmount`: Amount of USDC to withdraw

**Requirements**:
- Only callable by contract owner
- Withdraw amounts cannot exceed available balances

**Events Emitted**: `Withdrawal`

#### `pause()` / `unpause()`
**Description**: Emergency control functions to pause/unpause contract operations.

**Requirements**:
- Only callable by contract owner

### View Functions

#### `getBalance()`
**Description**: Get current contract balances.

**Returns**: 
- `ethBalance`: Current ETH balance
- `usdcBalance`: Current USDC balance

#### `getPayment(bytes32 paymentId)`
**Description**: Retrieve details of a specific payment.

**Parameters**:
- `paymentId`: Unique payment identifier

**Returns**: `Payment` struct containing:
- `payer`: Address of payer
- `amount`: Payment amount
- `isEth`: Boolean indicating if payment was ETH
- `timestamp`: Block timestamp of payment
- `processed`: Boolean indicating if payment was processed

### Constants

- `MIN_ETH_PAYMENT`: 0.0001 ETH (0.1 mETH)
- `MAX_ETH_PAYMENT`: 10 ETH
- `MIN_USDC_PAYMENT`: 1,000,000 (1 USDC with 6 decimals)
- `MAX_USDC_PAYMENT`: 1,000,000,000,000,000 (1M USDC with 6 decimals)

## Frontend Hooks

### `useTelopayContractData(contractAddress)`
**Description**: Read contract data including balances and limits.

**Parameters**:
- `contractAddress`: Telopay contract address

**Returns**:
```typescript
{
  balance: [bigint, bigint] | undefined,
  minEthPayment: bigint | undefined,
  minUsdcPayment: bigint | undefined,
  maxEthPayment: bigint | undefined,
  maxUsdcPayment: bigint | undefined,
  isLoading: boolean
}
```

### `usePrepareTelopayPayETH()`
**Description**: Prepare ETH payment transaction.

**Parameters**:
- `value`: Amount in wei
- `enabled`: Enable preparation
- `contractAddress`: Contract address

### `usePrepareTelopayPayUSDC()`
**Description**: Prepare USDC payment transaction.

**Parameters**:
- `amount`: Amount in wei (6 decimals)
- `enabled`: Enable preparation
- `contractAddress`: Contract address
- `usdcContract`: USDC contract address

### `useTelopayPayETH(config)` / `useTelopayPayUSDC(config)`
**Description**: Execute prepared payment transactions.

**Parameters**:
- `config`: Transaction configuration from preparation hooks

## Error Handling

### Common Error Scenarios

1. **Network Issues**
   - RPC endpoint unavailable
   - Network congestion
   - Gas price too low

2. **Wallet Issues**
   - Insufficient gas
   - Wallet disconnected
   - Network mismatch

3. **Contract Issues**
   - Contract paused
   - Payment limits exceeded
   - Transfer failures

### Error Recovery Strategies

1. **Automatic Retries**
   - Network errors: retry with exponential backoff
   - Gas estimation: retry with higher gas limit

2. **User Guidance**
   - Clear error messages
   - Suggested actions
   - Support contact information

3. **Fallback Mechanisms**
   - Alternative RPC endpoints
   - Manual transaction submission
   - Payment queue for high-load periods

## Security Considerations

### Smart Contract Security
- Reentrancy protection on all state-changing functions
- Access controls using OpenZeppelin's Ownable
- Input validation and bounds checking
- Emergency pause functionality

### Frontend Security
- Client-side validation mirrors contract validation
- Secure wallet integration via WalletConnect
- Environment variable protection
- Transaction confirmation requirements

### Best Practices
- Always verify transaction success before updating UI
- Implement proper loading states during transactions
- Cache contract data to reduce RPC calls
- Use appropriate gas estimation
- Handle network changes gracefully

## Rate Limiting

Current implementation does not include rate limiting. For production use, consider implementing:

- Per-address payment frequency limits
- IP-based rate limiting
- Cumulative payment amount limits
- Suspicious activity monitoring

## Gas Optimization

Current gas usage:
- ETH payment: ~45,000 gas
- USDC payment: ~85,000 gas
- Withdrawals: ~50,000-100,000 gas

Optimization strategies:
- Batch multiple payments
- Use EIP-1559 for better gas estimation
- Implement proxy patterns for upgradeability