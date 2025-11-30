import './globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/components/wallet-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Telopay - Micro-payments for Web3',
  description: 'Pay small amounts of crypto (ETH or USDC) on Base network for access to actions or content',
  keywords: 'telopay, web3, crypto, payments, base, eth, usdc, micro-payments',
  authors: [{ name: 'Telopay Team' }],
  openGraph: {
    title: 'Telopay - Micro-payments for Web3',
    description: 'Pay small amounts of crypto (ETH or USDC) on Base network for access to actions or content',
    url: 'https://telopay.app',
    siteName: 'Telopay',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telopay - Micro-payments for Web3',
    description: 'Pay small amounts of crypto (ETH or USDC) on Base network for access to actions or content',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}