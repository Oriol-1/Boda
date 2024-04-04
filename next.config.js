const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.sandraioriol.net',
        },
      ],
    },
    env: {
      DATABASE_HOST: process.env.DATABASE_HOST,
      DATABASE_PORT: process.env.DATABASE_PORT,
      DATABASE_USER: process.env.DATABASE_USER,
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
      DATABASE_NAME: process.env.DATABASE_NAME,
    },
    // Agrega aquí cualquier otra configuración específica de Next.js que necesites
  };
  
  module.exports = nextConfig;
  