import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../libs/mysql';

// Define la interfaz para los detalles de los hijos
interface ChildDetail {
  name: string;
  menuType: string; // Ajusta los tipos según tus necesidades
  isSpecialMenu: boolean;
  specialMenuType: string;
  customMenuType: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Método no permitido' });
    return;
  }

  const db = await connectToDatabase();
  if (!db) {
    res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
    return;
  }

  try {
    const {
      name, menuType, specialMenuType, customMenuType, hasCompanion,
      companionName, companionMenuType, companionSpecialMenuType,
      companionCustomMenuType, hasChildren, childrenDetails, contactPhone,
      hasFoodAllergy, allergyDetails
    } = req.body;

    const queryInvitados = 'INSERT INTO invitados (nombre, menu_principal_tipo, ...) VALUES (?, ?, ...)';
    const [result] = await db.execute(queryInvitados, [/* tus valores */]);
    const invitadoId = (result as mysql.OkPacket).insertId;

    if (hasChildren) {
      const queryHijos = 'INSERT INTO hijos (...) VALUES ?';
      const valuesHijos = childrenDetails.map((child: ChildDetail) => [/* tus valores */]);
      await db.query(queryHijos, [valuesHijos]);
    }

    await db.end();

    res.status(200).json({ message: 'Formulario enviado con éxito', invitadoId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al procesar el formulario:', error.message);
      res.status(500).json({ message: 'Error al procesar el formulario', error: error.message });
    } else {
      console.error('Error desconocido al procesar el formulario');
      res.status(500).json({ message: 'Error desconocido al procesar el formulario' });
    }
  }
}
