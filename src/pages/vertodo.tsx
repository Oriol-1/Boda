import React, { useEffect, useState } from 'react';

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
  menuPrincipalTipoOtro?: string;
  acompanante: boolean;
  nombreAcompanante?: string;
  menuAcompananteTipo?: 'estandar' | 'especial' | 'otro';
  menuAcompananteTipoEspecial?: 'vegetariano' | 'gluten' | 'otro';
  menuAcompananteTipoOtro?: string;
  telefonoContacto?: string;
  opcionTransporte?: 'bus' | 'car';
  hijosDetalles: ChildDetail[];
}

// Suponiendo que esta es la estructura de datos que recibes del backend
interface ApiResponse {
  invitados: Invitado[];
  totalNombres: number;
  totalAcompanantes: number;
  totalNinos: number;
  totalBus: number;
  totalCar: number;
}

const VerInvitados = () => {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [totalNombres, setTotalNombres] = useState<number>(0);
  const [totalAcompanantes, setTotalAcompanantes] = useState<number>(0);
  const [totalNinos, setTotalNinos] = useState<number>(0);
  const [totalBus, setTotalBus] = useState<number>(0);
  const [totalCar, setTotalCar] = useState<number>(0);

  useEffect(() => {
    const fetchInvitados = async () => {
      try {
        const response = await fetch('/api/invitados');
        if (!response.ok) {
          throw new Error('Error al cargar los datos de los invitados');
        }
        const data: ApiResponse = await response.json();
        setInvitados(data.invitados);
        // Actualizar los totales basados en los datos recibidos
        setTotalNombres(data.totalNombres);
        setTotalAcompanantes(data.totalAcompanantes);
        setTotalNinos(data.totalNinos);
        setTotalBus(data.totalBus);
        setTotalCar(data.totalCar);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Ocurrió un error desconocido');
      }
    };

    fetchInvitados();
  }, []);

  return (
    <>
      <h1>Lista de Invitados</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Menú Principal</th>
                <th>Nombre Acompañante</th>
                <th>Menú Acompañante</th>
                <th>Detalles Hijos</th>
                <th>Opción de Transporte</th>
              </tr>
            </thead>
            <tbody>
              {invitados.map((invitado, index) => (
                <React.Fragment key={invitado.id}>
                  <tr>
                    <td style={{ textAlign: 'center' }}>{invitado.id}</td>
                    <td>{invitado.nombre}</td>
                    <td>
                      {`${invitado.menuPrincipalTipo || ''} ${invitado.menuPrincipalTipoEspecial ? `(${invitado.menuPrincipalTipoEspecial}${invitado.menuPrincipalTipoEspecial === 'otro' && invitado.menuPrincipalTipoOtro ? `: ${invitado.menuPrincipalTipoOtro}` : ''})` : ''}`}
                    </td>
                    <td>{invitado.acompanante ? invitado.nombreAcompanante : 'Sin acompañante'}</td>
                    <td>
                      {invitado.acompanante ?
                        `${invitado.menuAcompananteTipo || ''} ${
                          invitado.menuAcompananteTipoEspecial ? `(${invitado.menuAcompananteTipoEspecial}${invitado.menuAcompananteTipoEspecial === 'otro' && invitado.menuAcompananteTipoOtro ? `: ${invitado.menuAcompananteTipoOtro}` : ''})` : ''
                        }` : 'N/A'}
                    </td>
                    <td>
                      {invitado.hijosDetalles.map((hijo, index) => (
                        <div key={index}>
                          {`${hijo.nombre}: ${hijo.tipoMenu}${hijo.menuEspecial ? ` (${hijo.menuEspecialTipo}${hijo.menuEspecialTipo === 'otro' ? `: ${hijo.menuEspecialTipoOtro}` : ''})` : ''}`}
                        </div>
                      ))}
                    </td>
                    <td style={{ textAlign: 'center' }}>{invitado.opcionTransporte}</td>
                  </tr>
                  {index !== invitados.length - 1 && (
                    <tr key={`${invitado.id}-separator`}>
                      <td colSpan={7}><hr /></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}>
            <p>Total Nombres: {totalNombres}</p>
            <p>Total Acompañantes: {totalAcompanantes}</p>
            <p>Total Niños: {totalNinos}</p>
            <p>Total en Bus: {totalBus}</p>
            <p>Total en Car: {totalCar}</p>
          </div>
        </>
      )}
    </>
  );
};

export default VerInvitados;
