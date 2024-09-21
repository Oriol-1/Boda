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
        DATABASE_PORT: '3306',
        DATABASE_USER: 'admin',
        DATABASE_PASSWORD: 'oriol1983',
        DATABASE_NAME: 'bodas'

        // DATABASE_HOST: 'localhost', 
        // DATABASE_PORT: '3306',
        // DATABASE_USER: 'root',
        // DATABASE_PASSWORD: 'Basebodasabdra83', 
        // DATABASE_NAME: 'bodas',
    },
    // Agrega aquí cualquier otra configuración específica de Next.js que necesites
};

module.exports = nextConfig;
