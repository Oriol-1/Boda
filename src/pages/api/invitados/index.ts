import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../app/libs/mysql';
import { RowDataPacket } from 'mysql2/promise';

interface ChildDetail {
  id: number;
  nombre: string;
  tipoMenu: string;
  menuEspecial: boolean;
  menuEspecialTipo?: string;
  menuEspecialTipoOtro?: string;
  opcionTransporte?: string;
}

interface Invitado {
  id: number;
  nombre: string;
  menuPrincipalTipo?: string;
  menuPrincipalTipoEspecial?: string;
  menuPrincipalTipoOtro?: string;
  acompanante: boolean;
  nombreAcompanante?: string;
  menuAcompananteTipo?: string;
  menuAcompananteTipoEspecial?: string;
  menuAcompananteTipoOtro?: string;
  telefonoContacto?: string;
  opcionTransporte?: string;
  hijosDetalles: ChildDetail[];
}

type ApiResponse = 
  | { invitados: Invitado[]; totalNombres: number; totalAcompanantes: number; totalNinos: number; totalBus: number; totalCar: number; totalNombresYAcompanantes: number }
  | { message: string; error?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Método no permitido' });
    return;
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
      return;
    }

    const [rows] = await db.query<RowDataPacket[]>(`
    SELECT i.id, i.nombre, i.menu_principal_tipo, i.menu_principal_tipo_especial, i.menu_principal_tipo_otro, /* Agregamos el campo faltante */
    i.acompanante, i.nombre_acompanante, i.menu_acompanante_tipo, i.menu_acompanante_tipo_especial, i.menu_acompanante_tipo_otro,
    i.telefono_contacto, i.opcion_transporte,
    h.id AS hijo_id, h.nombre AS hijo_nombre, h.tipo_menu AS hijo_tipo_menu,
    h.menu_especial, h.menu_especial_tipo, h.menu_especial_tipo_otro
FROM invitados i
LEFT JOIN hijos h ON i.id = h.invitado_id
    `);

    const invitadosMap: Record<number, Invitado> = {};
    rows.forEach(row => {
      let invitado = invitadosMap[row.id];
      if (!invitado) {
        invitado = invitadosMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          menuPrincipalTipo: row.menu_principal_tipo,
          menuPrincipalTipoEspecial: row.menu_principal_tipo_especial,
          menuPrincipalTipoOtro: row.menu_principal_tipo_otro,
          acompanante: row.acompanante === 1,
          nombreAcompanante: row.nombre_acompanante,
          menuAcompananteTipo: row.menu_acompanante_tipo,
          menuAcompananteTipoEspecial: row.menu_acompanante_tipo_especial,
          menuAcompananteTipoOtro: row.menu_acompanante_tipo_otro,
          telefonoContacto: row.telefono_contacto,
          opcionTransporte: row.opcion_transporte,
          hijosDetalles: [],
        };
      }

      if (row.hijo_id) {
        invitado.hijosDetalles.push({
          id: row.hijo_id,
          nombre: row.hijo_nombre,
          tipoMenu: row.hijo_tipo_menu,
          menuEspecial: row.menu_especial === 1,
          menuEspecialTipo: row.menu_especial_tipo,
          menuEspecialTipoOtro: row.menu_especial_tipo_otro,
          opcionTransporte: row.opcion_transporte,
        });
      }
    });

    // Calculo de totales
    const invitados = Object.values(invitadosMap);
    const totalNombres = invitados.length;
    const totalAcompanantes = invitados.filter(i => i.acompanante).length;
    const totalNinos = invitados.reduce((acc, curr) => acc + curr.hijosDetalles.length, 0);
    const totalBus = invitados.filter(i => i.opcionTransporte === 'bus').length;
    const totalCar = invitados.filter(i => i.opcionTransporte === 'car').length;
    const totalNombresYAcompanantes = totalNombres + totalAcompanantes;

    res.status(200).json({
      invitados,
      totalNombres,
      totalAcompanantes,
      totalNinos,
      totalBus,
      totalCar,
      totalNombresYAcompanantes
    });
  } catch (error) {
    console.error('Error al obtener los datos de los invitados:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Un error desconocido ocurrió' });
  }
}
