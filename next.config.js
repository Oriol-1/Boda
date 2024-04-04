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
        DATABASE_HOST: 'instanciadbboda.c74u0c4wuzrm.eu-west-1.rds.amazonaws.com',
        DATABASE_PORT: '3306', // Asegúrate de que el puerto esté definido como una cadena
        DATABASE_USER: 'admin',
        DATABASE_PASSWORD: 'oriol1983',
        DATABASE_NAME: 'bodas'
    },
    // Agrega aquí cualquier otra configuración específica de Next.js que necesites
};

module.exports = nextConfig;
