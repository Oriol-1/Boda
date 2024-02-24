/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/.well-known/pki-validation/A02BE60F398BE4A8EB32A76CF0240B51.txt',
        destination: '/A02BE60F398BE4A8EB32A76CF0240B51.txt',
        permanent: true,
      },
    ]
   },
}
