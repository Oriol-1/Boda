import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql';

// Definición de la estructura de los detalles de un hijo
interface ChildDetail {
  name: string;
  menuType: string;
  isSpecialMenu: boolean;
  specialMenuType?: string;
}

// Definición de la estructura de los datos del invitado
interface GuestData {
  name: string;
  menuType: string;
  specialMenuType?: string;
  customMenuType?: string;
  hasCompanion: boolean;
  companionName?: string;
  companionMenuType?: string;
  companionSpecialMenuType?: string;
  companionCustomMenuType?: string;
  hasChildren: boolean;
  childrenCount?: number;
  hasFoodAllergy: boolean;
  allergyDetails?: string;
  contactPhone: string;
  childrenDetails: ChildDetail[];
}

// Función principal que maneja las solicitudes HTTP a la ruta
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Datos recibidos:', req.body);  // Para depuración

  // Verificar que el método de la solicitud sea POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Método no permitido' });
    return;
  }

  // Conectar a la base de datos
  const db = await connectToDatabase();
  if (!db) {
    res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
    return;
  }

  try {
    // Extraer datos del invitado del cuerpo de la solicitud
    const guestData: GuestData = req.body;

    // Asegurarse de que los campos requeridos no sean undefined
    if (!guestData.name || !guestData.menuType || !guestData.hasCompanion || !guestData.hasChildren || !guestData.contactPhone) {
      res.status(400).json({ message: 'Faltan campos requeridos' });
      return;
    }

    // Preparar los valores para la inserción en la tabla 'invitados'
    const valuesInvitados = [
      guestData.name,
      guestData.menuType,
      guestData.specialMenuType || null,
      guestData.customMenuType || null,
      guestData.hasCompanion ? 1 : 0,
      guestData.companionName || null,
      guestData.companionMenuType || null,
      guestData.companionSpecialMenuType || null,
      guestData.companionCustomMenuType || null,
      guestData.hasChildren ? 1 : 0,
      guestData.childrenCount || null,
      guestData.hasFoodAllergy ? 1 : 0,
      guestData.allergyDetails || null,
      guestData.contactPhone
    ];

    // Consulta SQL para insertar un nuevo invitado
    const queryInvitados = `
      INSERT INTO invitados (
        nombre, menu_principal_tipo, menu_principal_tipo_especial,
        menu_principal_tipo_otro, acompanante, nombre_acompanante, 
        menu_acompanante_tipo, menu_acompanante_tipo_especial, 
        menu_acompanante_tipo_otro, hijos, cantidad_hijos, 
        alergia_alimentaria, detalles_alergia_alimentaria, telefono_contacto
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // Ejecución de la consulta
    const [resultInvitados] = await db.execute(queryInvitados, valuesInvitados);
    // Obtener el ID del invitado insertado
    const invitadoId = (resultInvitados as mysql.OkPacket).insertId;

    // Si el invitado tiene hijos, insertarlos en la tabla 'hijos'
    if (guestData.hasChildren && guestData.childrenDetails && guestData.childrenDetails.length > 0) {
      const queryHijos = `
        INSERT INTO hijos (invitado_id, nombre, tipo_menu, menu_especial, menu_especial_tipo)
        VALUES ?
      `;
      const valuesHijos = guestData.childrenDetails.map((child: ChildDetail) => [
        invitadoId, 
        child.name, 
        child.menuType,
        child.isSpecialMenu ? 1 : 0,
        child.specialMenuType || null
      ]);
      // Ejecución de la consulta para insertar hijos
      await db.query(queryHijos, [valuesHijos]);
    }

    // Finalizar la conexión con la base de datos
    await db.end();
    // Enviar respuesta al cliente
    res.status(200).json({ message: 'Formulario enviado con éxito', invitadoId });
  } catch (error) {
    // Manejo de errores
    console.error('Error al procesar el formulario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
