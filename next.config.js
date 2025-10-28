/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com', 'api.qrserver.com', 'res.cloudinary.com']
  },
  async rewrites() {
    return [
      {
        source: '/server-info',
        destination: 'http://localhost:5500/server-info'
      },
      {
        source: '/images',
        destination: 'http://localhost:5500/images'
      }
    ]
  },
  // Configuración específica para Vercel
  serverExternalPackages: ['cloudinary']
}

module.exports = nextConfig