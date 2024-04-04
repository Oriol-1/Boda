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
        host: 'instanciadbboda.c74u0c4wuzrm.eu-west-1.rds.amazonaws.com',
        port: 3306,
        user: 'admin',
        password: 'oriol1983',
        database: 'bodas'
    },
    // Agrega aquí cualquier otra configuración específica de Next.js que necesites
};

module.exports = nextConfig;
