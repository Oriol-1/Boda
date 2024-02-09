import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { connectToDatabase } from '../../../app/libs/mysql';

// Define la estructura de los datos de un invitado que no asistirá
interface NonAttendeeData {
    nombre: string;
    razon?: string;
    email?: string;
    telefono?: string;
    comentario?: string;
}

// Función para manejar las peticiones a la ruta
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Asegura que solo se acepten peticiones POST
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    // Conexión a la base de datos
    const db = await connectToDatabase();
    if (!db) {
        res.status(500).json({ message: 'No se pudo conectar a la base de datos' });
        return;
    }

    try {
        // Extrae los datos del cuerpo de la petición
        const nonAttendeeData: NonAttendeeData = req.body;

        // Consulta SQL para insertar los datos en la tabla InvitadosNoAsistentes
        const query = `
            INSERT INTO InvitadosNoAsistentes (nombre, razon, email, telefono, comentario)
            VALUES (?, ?, ?, ?, ?)
        `;
        // Valores para la consulta SQL
        const values = [
            nonAttendeeData.nombre,
            nonAttendeeData.razon || null,
            nonAttendeeData.email || null,
            nonAttendeeData.telefono || null,
            nonAttendeeData.comentario || null
        ];

        // Ejecuta la consulta
        await db.execute(query, values);

        // Envía una respuesta exitosa
        res.status(200).json({ message: 'Datos de no asistente guardados con éxito' });
    } catch (error) {
        // Maneja cualquier error que ocurra durante el proceso
        if (error instanceof Error) {
            console.error('Error al guardar datos del no asistente:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        } else {
            console.error('Se produjo un error desconocido');
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } finally {
        // Cierra la conexión a la base de datos
        await db.end();
    }
}
