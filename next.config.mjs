/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'useleadsup.com',
          },
        ],
        destination: 'https://www.useleadsup.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig