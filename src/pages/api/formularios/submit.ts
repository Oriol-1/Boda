import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql';

interface ChildDetail {
    name: string;
    menuType: string;
    isSpecialMenu: boolean;
    specialMenuType?: string;
    customMenuType?: string;
}

interface GuestData {
    name: string;
    menuType?: string;
    specialMenuType?: string;
    customMenuType?: string;
    hasCompanion?: boolean;
    companionName?: string;
    companionMenuType?: string;
    companionSpecialMenuType?: string;
    companionCustomMenuType?: string;
    hasChildren?: boolean;
    childrenCount?: number;
    hasFoodAllergy?: boolean;
    allergyDetails?: string;
    contactPhone: string;
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

        // Registrar los datos recibidos para depuración
        console.log("Datos recibidos:", guestData);

        // Verificar campos obligatorios
        if (!guestData.name || guestData.name.trim() === '' || !guestData.contactPhone || guestData.contactPhone.trim() === '') {
            res.status(400).json({ message: 'Nombre y teléfono son campos obligatorios' });
            return;
        }

        // Preparar valores para la inserción en la base de datos
        const valuesInvitados = [
            guestData.name,
            guestData.menuType || null,
            guestData.specialMenuType || null,
            guestData.customMenuType || null,
            guestData.hasCompanion ? 1 : 0,
            guestData.companionName || null,
            guestData.companionMenuType || null,
            guestData.companionSpecialMenuType || null,
            guestData.companionCustomMenuType || null,
            guestData.hasChildren ? 1 : 0,
            guestData.childrenCount || 0,
            guestData.hasFoodAllergy ? 1 : 0,
            guestData.allergyDetails || null,
            guestData.contactPhone
        ];

        // Inserción en la tabla de invitados
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

        // Inserción en la tabla de hijos (si corresponde)
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
                child.specialMenuType || null,
                child.specialMenuType === 'otro' ? child.customMenuType : null // Asegúrate de incluir este cambio
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
