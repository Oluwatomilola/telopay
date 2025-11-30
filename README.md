# Telopay - Micro-payments for Web3

![Telopay Banner](https://img.shields.io/badge/Telopay-Micro--payments-blue?style=for-the-badge&logo=ethereum)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![Base](https://img.shields.io/badge/Network-Base-0052FF?style=for-the-badge&logo=binance)

Telopay is a complete decentralized application (dApp) that enables micro-payments in crypto (ETH and USDC) on the Base network for accessing actions, content, or services. Built with modern Web3 technologies, it provides a seamless payment experience with transparent transaction tracking and gas optimization.

## 🚀 Features

- **Multi-token Support**: Pay with ETH or USDC on Base network
- **Gas Optimized**: Built with gas-efficient Solidity patterns
- **WalletConnect Integration**: Support for all major Web3 wallets
- **Real-time Transactions**: Live transaction status and confirmation
- **Secure Payments**: Smart contract with reentrancy protection and access controls
- **Responsive Design**: Beautiful, mobile-first UI with TailwindCSS
- **Complete Testing**: Comprehensive test suite with Foundry

## 🏗️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.19
- **Foundry** (development, testing, deployment)
- **OpenZeppelin** (security patterns)

### Frontend
- **Next.js** 14 with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Reown WalletConnect** for wallet integration
- **Viem & Wagmi** for contract interactions
- **React Query** for data fetching

### Infrastructure
- **Base Network** (mainnet & testnet)
- **BaseScan** for contract verification

## 📁 Project Structure

```
telopay/
├── contracts/                 # Foundry smart contract project
│   ├── src/                  # Smart contract source code
│   │   └── Telopay.sol      # Main payment contract
│   ├── test/                 # Test files
│   │   └── Telopay.t.sol   # Comprehensive test suite
│   ├── script/              # Deployment scripts
│   │   └── DeployTelopay.s.sol
│   ├── foundry.toml         # Foundry configuration
│   ├── package.json         # Dependencies and scripts
│   └── remappings.txt       # Dependency remappings
├── frontend/                # Next.js frontend application
│   ├── app/                # Next.js 14 App Router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── pay/            # Payment pages
│   │       └── page.tsx
│   ├── components/         # React components
│   │   ├── wallet-provider.tsx
│   │   ├── wallet-button.tsx
│   │   ├── payment-form.tsx
│   │   ├── transaction-status.tsx
│   │   └── wallet-connect-prompt.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTelopayContract.ts
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   ├── package.json        # Dependencies and scripts
│   ├── tailwind.config.js  # TailwindCSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── next.config.js      # Next.js configuration
├── .env.example            # Environment variables template
└── README.md              # This file
```

## 🧪 Smart Contract

### Telopay.sol Features

- **PayETH()**: Send ETH payments for services/content
- **PayUSDC(uint256)**: Send USDC payments (requires approval)
- **Withdraw Functions**: Owner-only withdrawal of accumulated funds
- **Payment Tracking**: All payments logged with unique IDs
- **Security Features**:
  - ReentrancyGuard protection
  - Pausable contract for emergencies
  - Minimum/maximum payment limits
  - Access controls (Ownable pattern)

### Contract Limits

| Token | Minimum | Maximum |
|-------|---------|---------|
| ETH   | 0.0001 ETH | 10 ETH |
| USDC  | 1 USDC | 1,000,000 USDC |

### Events

- `PaymentReceived`: Emitted for every successful payment
- `Withdrawal`: Emitted when owner withdraws funds
- `EmergencyWithdrawal`: Emitted for emergency token withdrawals

## 🎨 Frontend Features

### Wallet Integration
- **WalletConnect**: Seamless wallet connection
- **Multi-network**: Support for Base mainnet and Sepolia testnet
- **Balance Display**: Real-time ETH and USDC balance checking
- **Transaction History**: Transaction status and confirmation tracking

### Payment Interface
- **Token Selection**: Easy ETH/USDC toggle
- **Amount Validation**: Real-time balance and limit checking
- **Quick Amounts**: Preset payment buttons for common amounts
- **Transaction Status**: Real-time payment confirmation

### UI/UX
- **Responsive Design**: Works on all device sizes
- **Modern Styling**: Clean, professional interface
- **Loading States**: Clear feedback during transactions
- **Error Handling**: Comprehensive error messages

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Foundry (forge, cast, anvil)
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd telopay

# Install contracts dependencies
cd contracts
forge install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# Add your private keys and API keys
```

### 3. Smart Contract Development

```bash
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Run with coverage
forge coverage

# Start local development node
anvil

# Deploy to local network (in another terminal)
forge script script/DeployTelopay.s.sol --fork-url http://localhost:8545 --broadcast
```

### 4. Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Smart Contract Deployment

#### Base Sepolia (Testnet)

```bash
cd contracts

# Deploy to testnet
forge script script/DeployTelopay.s.sol \
  --fork-url base-sepolia \
  --broadcast \
  --verify
```

#### Base Mainnet

```bash
# Deploy to mainnet (use real private key!)
forge script script/DeployTelopay.s.sol \
  --fork-url base-mainnet \
  --broadcast \
  --verify
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Manual Build

```bash
cd frontend

# Build for production
npm run build

# Deploy 'out' directory to your hosting provider
```

## 📝 Configuration

### Environment Variables

#### Contracts (.env)

```bash
# Private keys (testnet/mainnet)
PRIVATE_KEY_BASE_SEPOLIA=0x...
PRIVATE_KEY_BASE_MAINNET=0x...

# API keys for verification
BASE_MAINNET_API_KEY=your_key
BASE_SEPOLIA_API_KEY=your_key

# RPC endpoints
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASE_MAINNET_RPC=https://mainnet.base.org
```

#### Frontend (.env.local)

```bash
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id

# Contract addresses (update after deployment)
NEXT_PUBLIC_TELOPAY_CONTRACT=0x...

# Network URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Token addresses
NEXT_PUBLIC_USDC_CONTRACT_BASE=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_USDC_CONTRACT_SEPOLIA=0x036CbD53842c5426634e7929541cC2318f0aD41e
```

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts

# Run all tests
forge test

# Run with gas report
forge test --gas-report

# Run specific test
forge test --match-path test/Telopay.t.sol --match-test testPayETH_Success
```

### Frontend Testing

```bash
cd frontend

# Type checking
npm run type-check

# ESLint
npm run lint
```

## 📊 Contract Verification

After deployment, contracts are automatically verified on BaseScan:

- **Mainnet**: https://basescan.org
- **Testnet**: https://sepolia.basescan.org

View verified contracts and interact with them directly through the explorer.

## 🔒 Security Considerations

### Smart Contract Security
- **Reentrancy Protection**: Using OpenZeppelin's ReentrancyGuard
- **Access Control**: Owner-only administrative functions
- **Input Validation**: All payment amounts validated against limits
- **Emergency Controls**: Pausable contract for security incidents

### Frontend Security
- **Client-side Validation**: All inputs validated before transaction
- **Wallet Integration**: Secure wallet connection with WalletConnect
- **Environment Variables**: Sensitive data properly handled

## 📈 Usage Examples

### Making a Payment

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Select Token**: Choose between ETH or USDC
3. **Enter Amount**: Input payment amount (within limits)
4. **Confirm Transaction**: Review and confirm payment in your wallet
5. **Track Status**: Monitor transaction confirmation in real-time

### Contract Interaction (Advanced)

```solidity
// ETH Payment
contract.payETH{value: 0.01 ether}()

// USDC Payment (requires approval)
IERC20(usdcToken).approve(contractAddress, amount)
contract.payUSDC(amount)

// Check balances
(ethBalance, usdcBalance) = contract.getBalance()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Network**: For providing the underlying infrastructure
- **OpenZeppelin**: For battle-tested smart contract libraries
- **Foundry**: For the excellent smart contract development framework
- **Next.js**: For the powerful React framework
- **WalletConnect**: For seamless wallet integration

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ for the decentralized web on Base**