/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable development indicators completely
  devIndicators: false,
  // Disable development overlay
  experimental: {
    scrollRestoration: true,
  }
}

export default nextConfig
