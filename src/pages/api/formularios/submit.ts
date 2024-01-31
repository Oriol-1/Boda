import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql';

interface ChildDetail {
  name: string;
  tipoMenu: string;
  menuEspecial: boolean;
  menuEspecialTipo: string;
  menuEspecialTipoOtro: string;
}

interface GuestData {
  nombre: string;
  menuPrincipalTipo: string;
  menuPrincipalTipoEspecial?: string;
  menuPrincipalTipoOtro?: string;
  acompanante: boolean;
  nombreAcompanante?: string;
  menuAcompananteTipo?: string;
  menuAcompananteTipoEspecial?: string;
  menuAcompananteTipoOtro?: string;
  hijos: boolean;
  cantidadHijos?: number;
  alergiaAlimentaria: boolean;
  detallesAlergiaAlimentaria?: string;
  telefonoContacto: string;
  childrenDetails: ChildDetail[];
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

    const valuesInvitados = [
      guestData.nombre,
      guestData.menuPrincipalTipo,
      guestData.menuPrincipalTipoEspecial || null,
      guestData.menuPrincipalTipoOtro || null,
      guestData.acompanante ? 1 : 0,
      guestData.nombreAcompanante || null,
      guestData.menuAcompananteTipo || null,
      guestData.menuAcompananteTipoEspecial || null,
      guestData.menuAcompananteTipoOtro || null,
      guestData.hijos ? 1 : 0,
      guestData.hijos ? guestData.cantidadHijos || null : null,
      guestData.alergiaAlimentaria ? 1 : 0,
      guestData.detallesAlergiaAlimentaria || null,
      guestData.telefonoContacto
    ];

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
    const [resultInvitados] = await db.execute(queryInvitados, valuesInvitados);
    const invitadoId = (resultInvitados as mysql.OkPacket).insertId;

    if (guestData.hijos && guestData.childrenDetails && guestData.childrenDetails.length > 0) {
      const queryHijos = `
        INSERT INTO hijos (invitado_id, nombre, tipo_menu, menu_especial, menu_especial_tipo, menu_especial_tipo_otro)
        VALUES ?
      `;
      const valuesHijos = guestData.childrenDetails.map((child: ChildDetail) => [
        invitadoId, 
        child.name, 
        child.tipoMenu,
        child.menuEspecial ? 1 : 0,
        child.menuEspecialTipo || null,
        child.menuEspecialTipoOtro || null
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
