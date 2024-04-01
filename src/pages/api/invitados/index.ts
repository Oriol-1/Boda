import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../app/libs/mysql';
import { RowDataPacket } from 'mysql2/promise';

interface ChildDetail {
  id: number;
  nombre: string;
  tipoMenu: 'infantil' | 'adulto';
  menuEspecial: boolean;
  menuEspecialTipo?: 'vegetariano' | 'gluten' | 'otro';
  menuEspecialTipoOtro?: string;
  opcionTransporte?: 'bus' | 'car';
}

interface Invitado {
  id: number;
  nombre: string;
  menuPrincipalTipo?: 'estandar' | 'especial' | 'otro';
  menuPrincipalTipoEspecial?: 'vegetariano' | 'gluten' | 'otro';
  menuPrincipalTipoOtro?: string | undefined;
  acompanante?: boolean;
  nombreAcompanante?: string;
  menuAcompananteTipo?: 'estandar' | 'especial' | 'otro';
  menuAcompananteTipoEspecial?: 'vegetariano' | 'gluten' | 'otro';
  menuAcompananteTipoOtro?: string | undefined;
  telefonoContacto?: string;
  opcionTransporte?: 'bus' | 'car';
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
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
    }

    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT i.id, i.nombre, i.menu_principal_tipo, i.menu_principal_tipo_especial, i.menu_principal_tipo_otro,
             i.acompanante, i.nombre_acompanante, i.menu_acompanante_tipo, i.menu_acompanante_tipo_especial, i.menu_acompanante_tipo_otro,
             i.telefono_contacto, i.opcion_transporte,
             h.id AS hijo_id, h.nombre AS hijo_nombre, h.tipo_menu AS hijo_tipo_menu,
             h.menu_especial, h.menu_especial_tipo, h.menu_especial_tipo_otro
      FROM invitados i
      LEFT JOIN hijos h ON i.id = h.invitado_id
    `);

    const invitadosMap: Record<number, Invitado> = {};
    rows.forEach(row => {
      if (!invitadosMap[row.id]) {
        invitadosMap[row.id] = {
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
        invitadosMap[row.id].hijosDetalles.push({
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

    const invitados = Object.values(invitadosMap);
    const totalNombres = invitados.length;
    const totalAcompanantes = invitados.filter(invitado => invitado.acompanante).length;
    const totalNinos = invitados.reduce((acc, curr) => acc + curr.hijosDetalles.length, 0);
    const totalBus = invitados.filter(invitado => invitado.opcionTransporte === 'bus').length +
                     invitados.filter(invitado => invitado.opcionTransporte === 'bus' && invitado.acompanante).length +
                     invitados.reduce((acc, invitado) => acc + invitado.hijosDetalles.filter(hijo => invitado.opcionTransporte === 'bus').length, 0);
    const totalCar = invitados.filter(invitado => invitado.opcionTransporte === 'car').length +
                     invitados.filter(invitado => invitado.opcionTransporte === 'car' && invitado.acompanante).length +
                     invitados.reduce((acc, invitado) => acc + invitado.hijosDetalles.filter(hijo => invitado.opcionTransporte === 'car').length, 0);
    const totalNombresYAcompanantes = totalNombres + totalAcompanantes;

    res.status(200).json({ invitados, totalNombres, totalAcompanantes, totalNinos, totalBus, totalCar, totalNombresYAcompanantes });
  } catch (error) {
    console.error('Error al obtener los datos de los invitados:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Un error desconocido ocurrió' });
  }
}
