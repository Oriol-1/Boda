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
  menuPrincipalTipo?: 'estandar' | 'especial';
  menuPrincipalTipoEspecial?: 'vegetariano' | 'gluten' | 'otro';
  acompanante?: boolean;
  nombreAcompanante?: string;
  menuAcompananteTipo?: 'estandar' | 'especial';
  menuAcompananteTipoEspecial?: 'vegetariano' | 'gluten' | 'otro';
  telefonoContacto?: string;
  opcionTransporte?: 'bus' | 'car';
  hijosDetalles: ChildDetail[];
}

type ApiResponse =
  | { invitados: Invitado[]; totalNombres: number; totalAcompanantes: number; totalNinos: number; totalBus: number; totalNombresYAcompanantes: number }
  | { message: string; error?: string }; // Inclusión del campo `error` opcional aquí

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
      SELECT i.id, i.nombre, i.menu_principal_tipo, i.menu_principal_tipo_especial,
             i.acompanante, i.nombre_acompanante, i.telefono_contacto, i.opcion_transporte,
             h.id AS hijo_id, h.nombre AS hijo_nombre, h.tipo_menu AS hijo_tipo_menu,
             h.menu_especial, h.menu_especial_tipo, h.menu_especial_tipo_otro,
             i.menu_acompanante_tipo, i.menu_acompanante_tipo_especial
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
          acompanante: row.acompanante === 1,
          nombreAcompanante: row.nombre_acompanante,
          telefonoContacto: row.telefono_contacto,
          opcionTransporte: row.opcion_transporte,
          menuAcompananteTipo: row.menu_acompanante_tipo,
          menuAcompananteTipoEspecial: row.menu_acompanante_tipo_especial,
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
          opcionTransporte: row.opcion_transporte, // Aquí asumimos que los hijos siguen la elección de transporte del invitado
        });
      }
    });

    const invitados = Object.values(invitadosMap);
    const totalNombres = invitados.length;
    const totalAcompanantes = invitados.filter(invitado => invitado.acompanante).length;
    const totalNinos = invitados.reduce((acc, curr) => acc + curr.hijosDetalles.length, 0);
    const totalBus = invitados.reduce((acc, invitado) => {
      let subtotal = invitado.opcionTransporte === 'bus' ? 1 : 0; // Cuenta al invitado si va en bus
      subtotal += invitado.acompanante && invitado.opcionTransporte === 'bus' ? 1 : 0; // Cuenta al acompañante si existe y ambos van en bus
      subtotal += invitado.hijosDetalles.length; // Cuenta a los hijos
      return acc + subtotal;
    }, 0);
    const totalNombresYAcompanantes = totalNombres + totalAcompanantes;

    res.status(200).json({ invitados, totalNombres, totalAcompanantes, totalNinos, totalBus, totalNombresYAcompanantes });
  } catch (error) {
    console.error('Error al obtener los datos de los invitados:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Un error desconocido ocurrió' });
  }
}
