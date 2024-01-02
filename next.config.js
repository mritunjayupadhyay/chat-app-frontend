/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      formats: ['image/avif', 'image/webp'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pub-416a760c77f044d98b4a957925a825d5.r2.dev',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig
