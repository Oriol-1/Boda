import React, { useEffect, useState } from 'react';

interface Invitado {
    id: number; // Asumiendo que cada invitado tiene un ID único
    nombre: string;
    nombres_hijos?: string[]; // Un arreglo de nombres de hijos
    // Agrega aquí otros campos según tu base de datos
}

const VerInvitados = () => {
    const [invitados, setInvitados] = useState<Invitado[]>([]);

    useEffect(() => {
        const obtenerInvitados = async () => {
            const respuesta = await fetch('/api/invitados');
            const datos = await respuesta.json();
            setInvitados(datos);
        };

        obtenerInvitados();
    }, []);

    return (
        <div>
            <h1>Lista de Invitados</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Hijos</th>
                        {/* Agrega aquí más cabeceras de columna si es necesario */}
                    </tr>
                </thead>
                <tbody>
                    {invitados.map((invitado) => (
                        <tr key={invitado.id}>
                            <td>{invitado.nombre}</td>
                            <td>{invitado.nombres_hijos?.join(', ') || 'N/A'}</td>
                            {/* Muestra más datos del invitado aquí si es necesario */}
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
            `}</style>
        </div>
    );
};

export default VerInvitados;