import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../libs/mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await connectToDatabase();
    if (connection) {
      res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
    } else {
      res.status(500).json({ message: 'Error al conectar a la base de datos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
}