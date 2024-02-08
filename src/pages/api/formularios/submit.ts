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

        // Verificar campos obligatorios
        if (!guestData.name || guestData.name.trim() === '' || !guestData.contactPhone || guestData.contactPhone.trim() === '') {
            res.status(400).json({ message: 'Nombre y teléfono son campos obligatorios' });
            return;
        }

        await db.beginTransaction();

        // Inserción en la tabla de invitados
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
            guestData.hasChildren ? guestData.childrenCount : 0,
            guestData.allergyDetails || null,
            guestData.contactPhone,
            guestData.transportOption || null
        ];

        console.log('Insertando en invitados con datos:', valuesInvitados);
        const queryInvitados = `
            INSERT INTO invitados (
                nombre, menu_principal_tipo, menu_principal_tipo_especial,
                menu_principal_tipo_otro, acompanante, nombre_acompanante, 
                menu_acompanante_tipo, menu_acompanante_tipo_especial, 
                menu_acompanante_tipo_otro, hijos, 
                detalles_alergia_alimentaria, telefono_contacto, opcion_transporte
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [resultInvitados] = await db.execute(queryInvitados, valuesInvitados);
        const invitadoId = (resultInvitados as mysql.OkPacket).insertId;
        console.log('Inserción en invitados exitosa, ID:', invitadoId);

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
                child.specialMenuType === 'otro' ? child.customMenuType : null
            ]);
            console.log('Insertando en hijos con datos:', valuesHijos);
            await db.query(queryHijos, [valuesHijos]);
            console.log('Inserción en hijos exitosa');
        }

        await db.commit();
        res.status(200).json({ message: 'Formulario enviado con éxito', invitadoId });
    } catch (error) {
        await db.rollback();
    
        // Verificamos si el error es una instancia de Error para acceder a su propiedad 'message'
        if (error instanceof Error) {
            console.error('Error al procesar el formulario:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        } else {
            // Si el error no es una instancia de Error, manéjalo de manera genérica
            console.error('Se produjo un error desconocido');
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } finally {
        await db.end();
    }
}
