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
    transportOption?: 'bus' | 'car';
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

        if (!guestData.name || guestData.name.trim() === '' || !guestData.contactPhone || guestData.contactPhone.trim() === '') {
            res.status(400).json({ message: 'Nombre y teléfono son campos obligatorios' });
            return;
        }

        await db.beginTransaction();

        const numeroDeHijos = guestData.childrenDetails.length;

        const queryInvitados = `
            INSERT INTO invitados (
                nombre, menu_principal_tipo, menu_principal_tipo_especial,
                menu_principal_tipo_otro, acompanante, nombre_acompanante, 
                menu_acompanante_tipo, menu_acompanante_tipo_especial, 
                menu_acompanante_tipo_otro, hijos, 
                detalles_alergia_alimentaria, telefono_contacto, opcion_transporte
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
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
            numeroDeHijos,
            guestData.allergyDetails || null,
            guestData.contactPhone,
            guestData.transportOption || null
        ];
        const [resultInvitados] = await db.execute(queryInvitados, valuesInvitados);
        const invitadoId = (resultInvitados as mysql.OkPacket).insertId;

        if (guestData.hasChildren && guestData.childrenDetails.length > 0) {
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
                child.specialMenuType === 'otro' ? child.customMenuType : null
            ]);
            await db.query(queryHijos, [valuesHijos]);
        }

        await db.commit();
        res.status(200).json({ message: 'Formulario enviado con éxito', invitadoId });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al procesar el formulario:', error);
            await db.rollback();
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        } else {
            console.error('Se produjo un error desconocido');
            await db.rollback();
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } finally {
        await db.end();
    }
}
