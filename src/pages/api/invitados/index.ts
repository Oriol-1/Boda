// src/pages/api/invitados/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql'; // Ajusta la ruta según sea necesario

interface Invitado {
  id: number;
  nombre: string;
  nombres_hijos?: string[]; // Un arreglo de nombres de hijos
  // Agrega aquí otros campos relevantes
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Método no permitido' });
    return;
  }

  const db = await connectToDatabase();
  if (!db) {
    res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
    return;
  }

  try {
    const [result] = await db.query<mysql.RowDataPacket[]>(`
      SELECT i.*, GROUP_CONCAT(h.nombre SEPARATOR '; ') AS nombres_hijos
      FROM invitados i
      LEFT JOIN hijos h ON i.id = h.invitado_id
      GROUP BY i.id
    `);

    const invitadosConHijos: Invitado[] = result.map(row => ({
      id: row.id,
      nombre: row.nombre,
      nombres_hijos: row.nombres_hijos ? row.nombres_hijos.split('; ') : []
    }));

    res.status(200).json(invitadosConHijos);
  } catch (error) {
    console.error('Error al obtener los datos de los invitados:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: 'Error al procesar la solicitud' });
  } finally {
    await db.end();
  }
}
