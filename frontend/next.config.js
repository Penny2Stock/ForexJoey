/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable TypeScript checking for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  // Configure image domains
  images: {
    domains: ['forexjoey-backend.onrender.com'],
  },
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    return config;
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_ENV: 'production',
    NEXT_PUBLIC_API_BASE_URL: 'https://forexjoey-backend.onrender.com/api',
    NEXT_PUBLIC_WS_URL: 'wss://forexjoey-backend.onrender.com/api/ws',
  },
}

module.exports = nextConfig
