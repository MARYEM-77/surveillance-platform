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
    domains: ['localhost'], // 🔥 AJOUT ICI POUR ACCEPTER LES IMAGES DEPUIS LE BACKEND
  },
}

export default nextConfig
