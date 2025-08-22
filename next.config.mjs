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
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []

    return [
      { source: '/api/auth/:path*', destination: 'http://localhost:8081/api/auth/:path*' },
      { source: '/api/ops/:path*', destination: 'http://localhost:8082/api/ops/:path*' },
      { source: '/api/cop/:path*', destination: 'http://localhost:8083/api/cop/:path*' },
      { source: '/api/tasks/:path*', destination: 'http://localhost:8084/api/tasks/:path*' },
      { source: '/api/reports/:path*', destination: 'http://localhost:8085/api/reports/:path*' },
      { source: '/api/messages/:path*', destination: 'http://localhost:8086/api/messages/:path*' },
      { source: '/api/replay/:path*', destination: 'http://localhost:8087/api/replay/:path*' },
    ]
  },
}

export default nextConfig
