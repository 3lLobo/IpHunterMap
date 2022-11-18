import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: '/thehive/:path*',
        destination: 'http://localhost:9000/:path*' // Proxy to the Hive
      },
      {
        source: '/hunterBackend/:path*',
        destination: 'http://localhost:3002/:path*' // Proxy to ipHunter backend
      },
    ]
  },
  images: {
    domains: ["i.ebayimg.com", "flagcdn.com",],
  },
  pageExtensions: ['jsx', 'mdx'],
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
