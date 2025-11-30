import Link from 'next/link'
import { WalletButton } from '@/components/wallet-button'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">Telopay</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Micro-payments for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Web3
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pay small amounts of crypto (ETH or USDC) on the Base network for access to actions, content, 
            or services. Simple, fast, and secure micro-transactions built for the decentralized web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pay"
              className="btn-primary text-lg px-8 py-3"
            >
              Make a Payment
            </Link>
            <Link
              href="/how-it-works"
              className="btn-secondary text-lg px-8 py-3"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Telopay?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center telopay-card-hover">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Quick micro-payments processed instantly on the Base network with minimal fees.
              </p>
            </div>

            <div className="card p-6 text-center telopay-card-hover">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions are recorded on-chain with complete transparency and security.
              </p>
            </div>

            <div className="card p-6 text-center telopay-card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Tokens</h3>
              <p className="text-gray-600">
                Support for both ETH and USDC payments on the Base ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Wallet</h3>
                <p className="text-gray-600">
                  Connect your wallet using WalletConnect to interact with the Base network.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Payment</h3>
                <p className="text-gray-600">
                  Select ETH or USDC and enter the amount you want to pay for access or content.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Access</h3>
                <p className="text-gray-600">
                  Complete the transaction and receive immediate access to your desired content or action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Info */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Built on Base Network
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Telopay leverages the Base blockchain for fast, low-cost transactions. 
            Built by Coinbase, Base offers the perfect balance of security and usability.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Base Mainnet & Testnet Support</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                <h3 className="text-xl font-bold">Telopay</h3>
              </div>
              <p className="text-gray-400">
                Micro-payments for the decentralized web.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pay" className="hover:text-white">Make Payment</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How it Works</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Network</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span>Base Mainnet</span></li>
                <li><span>Base Sepolia</span></li>
                <li><a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">BaseScan</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tokens</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ethereum (ETH)</li>
                <li>USD Coin (USDC)</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Telopay. All rights reserved. Built with ❤️ on Base.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}