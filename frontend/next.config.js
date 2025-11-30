/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for wallet libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  env: {
    NEXT_PUBLIC_TELOPAY_CONTRACT: process.env.NEXT_PUBLIC_TELOPAY_CONTRACT,
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_USDC_CONTRACT_BASE: process.env.NEXT_PUBLIC_USDC_CONTRACT_BASE,
    NEXT_PUBLIC_USDC_CONTRACT_SEPOLIA: process.env.NEXT_PUBLIC_USDC_CONTRACT_SEPOLIA,
  },
}

module.exports = nextConfig