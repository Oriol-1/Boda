import mysql from 'mysql2/promise';
//conecta
export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({      
      // host: 'localhost',
      // port: 3306,
      // user: 'root',
      // password: 'Basebodasabdra83',
      // database: 'bodas'


      host: 'instanciadbboda.c74u0c4wuzrm.eu-west-1.rds.amazonaws.com',
      port: 3306,
      user: 'admin',
      password: 'oriol1983',
      database: 'bodas'
    });
    console.log('Conexión exitosa a la base de datos');
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return null;
  }
}
