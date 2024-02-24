/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/.well-known/pki-validation',
        destination: '/',
        permanent: true,
      },
    ]
   },
}
