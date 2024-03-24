import React, { useEffect, useState } from 'react';

interface ChildDetail {
  id: number;
  nombre: string;
  tipoMenu: 'infantil' | 'adulto';
  menuEspecial: boolean;
  menuEspecialTipo?: 'vegetariano' | 'gluten' | 'otro';
  menuEspecialTipoOtro?: string;
  opcionTransporte?: 'bus' | 'car'; // Añadido para considerar la opción de transporte del hijo
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

const VerInvitados = () => {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalNombres, setTotalNombres] = useState<number>(0);
  const [totalAcompanantes, setTotalAcompanantes] = useState<number>(0);
  const [totalNinos, setTotalNinos] = useState<number>(0);
  const [totalBus, setTotalBus] = useState<number>(0);

  useEffect(() => {
    const fetchInvitados = async () => {
      try {
        const response = await fetch('/api/invitados');
        if (!response.ok) throw new Error('Error al cargar los datos de los invitados');
        const data = await response.json();
        setInvitados(data.invitados);
        setTotalNombres(data.totalNombres);
        setTotalAcompanantes(data.totalAcompanantes);
        setTotalNinos(data.totalNinos);
        setTotalBus(data.totalBus);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocurrió un error desconocido');
        }
      }
    };

    fetchInvitados();
  }, []);

  return (
    <div>
      <h1>Lista de Invitados</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>ID</th>
              <th style={{ textAlign: 'center' }}>Nombre</th>
              <th style={{ textAlign: 'center' }}>Menu Principal</th>
              <th style={{ textAlign: 'center' }}>Nombre Acompañante</th>
              <th style={{ textAlign: 'center' }}>Menu Acompañante</th>
              <th style={{ textAlign: 'center' }}>Detalles Hijos</th>
              <th style={{ textAlign: 'center' }}>Opción de Transporte</th>
            </tr>
          </thead>
          <tbody>
            {invitados.map((invitado) => (
              <tr key={invitado.id}>
                <td style={{ textAlign: 'center' }}>{invitado.id}</td>
                <td style={{ textAlign: 'center' }}>{invitado.nombre}</td>
                <td style={{ textAlign: 'center' }}>{`${invitado.menuPrincipalTipo}${invitado.menuPrincipalTipoEspecial ? ` (${invitado.menuPrincipalTipoEspecial})` : ''}`}</td>
                <td style={{ textAlign: 'center' }}>{invitado.acompanante ? invitado.nombreAcompanante || 'N/A' : 'Sin acompañante'}</td>
                <td style={{ textAlign: 'center' }}>{invitado.acompanante ? `${invitado.menuAcompananteTipo}${invitado.menuAcompananteTipoEspecial ? ` (${invitado.menuAcompananteTipoEspecial})` : ''}` : 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  {invitado.hijosDetalles && invitado.hijosDetalles.length > 0 ? (
                    invitado.hijosDetalles.map((hijo, index) => (
                      <p key={index}>
                        {`${hijo.nombre}: ${hijo.tipoMenu}${hijo.menuEspecial ? `, ${hijo.menuEspecialTipo}${hijo.menuEspecialTipoOtro ? ` (${hijo.menuEspecialTipoOtro})` : ''}` : ''}`}
                      </p>
                    ))
                  ) : 'Sin hijos'}
                </td>
                <td style={{ textAlign: 'center' }}>{invitado.opcionTransporte || 'N/A'}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>Total Acompañantes: {totalAcompanantes}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>Total Hijos: {totalNinos}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>Total en Bus: {totalBus}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerInvitados;
