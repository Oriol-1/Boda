import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../app/libs/mysql';

interface ChildDetail {
  id: number;
  nombre: string;
  tipoMenu: 'infantil' | 'adulto';
  menuEspecial: boolean;
  menuEspecialTipo?: 'vegetariano' | 'gluten' | 'otro';
  menuEspecialTipoOtro?: string;
  opcionTransporte?: 'bus' | 'car'; // Agregar opcionTransporte aquí
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
  hijosDetalles?: ChildDetail[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ invitados: Invitado[]; totalNombres: number; totalAcompanantes: number; totalNinos: number; totalBus: number; totalNombresYAcompanantes: number } | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
    }

    const [rows] = await db.query(`
      SELECT i.id, i.nombre, i.menu_principal_tipo, i.menu_principal_tipo_especial,
             i.acompanante, i.nombre_acompanante, i.telefono_contacto, i.opcion_transporte,
             h.id AS hijo_id, h.nombre AS hijo_nombre, h.tipo_menu AS hijo_tipo_menu,
             h.menu_especial, h.menu_especial_tipo, h.menu_especial_tipo_otro,
             i.menu_acompanante_tipo, i.menu_acompanante_tipo_especial
      FROM invitados i
      LEFT JOIN hijos h ON i.id = h.invitado_id
    `);

    const invitadosMap: Record<number, Invitado> = {};
    for (const row of rows as any) {
      const { id, nombre, menu_principal_tipo, menu_principal_tipo_especial,
              acompanante, nombre_acompanante, telefono_contacto, opcion_transporte,
              hijo_id, hijo_nombre, hijo_tipo_menu, menu_especial, menu_especial_tipo,
              menu_especial_tipo_otro, menu_acompanante_tipo, menu_acompanante_tipo_especial } = row;

      if (!invitadosMap[id]) {
        invitadosMap[id] = {
          id,
          nombre,
          menuPrincipalTipo: menu_principal_tipo,
          menuPrincipalTipoEspecial: menu_principal_tipo_especial,
          acompanante: acompanante === 1,
          nombreAcompanante: nombre_acompanante,
          telefonoContacto: telefono_contacto,
          opcionTransporte: opcion_transporte,
          menuAcompananteTipo: menu_acompanante_tipo,
          menuAcompananteTipoEspecial: menu_acompanante_tipo_especial,
          hijosDetalles: [],
        };
      }

      if (hijo_nombre) {
        invitadosMap[id].hijosDetalles?.push({
          id: hijo_id,
          nombre: hijo_nombre,
          tipoMenu: hijo_tipo_menu,
          menuEspecial: menu_especial === 1,
          menuEspecialTipo: menu_especial_tipo,
          menuEspecialTipoOtro: menu_especial_tipo_otro,
        });
      }
    }

    const invitados = Object.values(invitadosMap);

    // Calcular totales
    let totalNombres = 0;
    let totalAcompanantes = 0;
    let totalNinos = 0;
    let totalBus = 0;

    invitados.forEach((invitado) => {
      // Contar al invitado principal
      totalNombres++;

      // Sumar al total de acompañantes
      if (invitado.acompanante) {
        totalAcompanantes++;
      }

      // Sumar al total de niños
      if (invitado.hijosDetalles && invitado.hijosDetalles.length > 0) {
        totalNinos += invitado.hijosDetalles.length;
        totalNombres += invitado.hijosDetalles.length;
      }

      // Sumar al total de personas que van en bus (solo para invitados principales)
      if (invitado.opcionTransporte === 'bus') {
        totalBus++;
      }

      // Sumar al total de personas que van en bus (acompañantes)
      if (invitado.acompanante && invitado.opcionTransporte === 'bus') {
        totalBus++;
      }

      // Sumar al total de personas que van en bus (hijos)
      if (invitado.hijosDetalles) {
        invitado.hijosDetalles.forEach((hijo) => {
          if (hijo.opcionTransporte === 'bus') {
            totalBus++;
          }
        });
      }
    });

    let totalNombresYAcompanantes = totalNombres + totalAcompanantes;

    res.status(200).json({ invitados, totalNombres, totalAcompanantes, totalNinos, totalBus, totalNombresYAcompanantes });
  } catch (error) {
    console.error('Error al obtener los datos de los invitados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
