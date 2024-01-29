import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql';

interface ChildDetail {
  name: string;
  menuType: string;
  isSpecialMenu: boolean;
  specialMenuType: string;
  customMenuType: string;
}

interface GuestData {
  name: string;
  menuType: string;
  specialMenuType: string;
  customMenuType: string;
  hasCompanion: boolean;
  companionName: string;
  companionMenuType: string;
  companionSpecialMenuType: string;
  companionCustomMenuType: string;
  hasChildren: boolean;
  childrenDetails: ChildDetail[];
  contactPhone: string;
  hasFoodAllergy: boolean;
  allergyDetails: string;
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
    const guestData: GuestData = req.body;

    // Asumiendo que tu tabla 'invitados' tiene columnas como 'nombre', 'menu_principal_tipo', etc.
    const queryInvitados = `
      INSERT INTO invitados (nombre, menu_principal_tipo)
      VALUES (?, ?)
    `;
    const [resultInvitados] = await db.execute(queryInvitados, [guestData.name, guestData.menuType]);
    const invitadoId = (resultInvitados as mysql.OkPacket).insertId;

    // Inserción de hijos, si corresponde
    if (guestData.hasChildren && guestData.childrenDetails && guestData.childrenDetails.length > 0) {
      const queryHijos = `
        INSERT INTO hijos (invitado_id, nombre, tipo_menu, menu_especial, menu_especial_tipo, menu_especial_tipo_otro)
        VALUES ?
      `;
      const valuesHijos = guestData.childrenDetails.map((child: ChildDetail) => [
        invitadoId, 
        child.name, 
        child.menuType,
        child.isSpecialMenu ? 1 : 0,
        child.specialMenuType,
        child.customMenuType
      ]);
      await db.query(queryHijos, [valuesHijos]);
    }

    await db.end();
    res.status(200).json({ message: 'Formulario enviado con éxito', invitadoId });
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
