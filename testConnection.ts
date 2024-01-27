const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port:3306,
      user: 'root',
      password: 'Basebodasabdra83',
      database: 'bodas'

    });

    console.log('Conexión exitosa');
    await connection.end();
  } catch (error) {
    console.error('Error en la conexión:', error);
  }
}

testConnection();
