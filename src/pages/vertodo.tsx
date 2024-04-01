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
        if (!response.ok) throw new Error('Error al cargar los datos de los invitados');
        const data = await response.json();
        setInvitados(data.invitados);
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
    <div>
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
                <th>Menú Principal Especial Otro</th>
                <th>Nombre Acompañante</th>
                <th>Menú Acompañante</th>
                <th>Menú Acompañante Especial Otro</th>
                <th>Detalles Hijos</th>
                <th>Opción de Transporte</th>
              </tr>
            </thead>
            <tbody>
              {invitados.map((invitado, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{invitado.id}</td>
                    <td>{invitado.nombre}</td>
                    <td>
                      {invitado.menuPrincipalTipo === 'otro'
                        ? invitado.menuPrincipalTipoOtro
                        : `${invitado.menuPrincipalTipo || ''} ${invitado.menuPrincipalTipoEspecial ? `(${invitado.menuPrincipalTipoEspecial})` : ''}`}
                    </td>
                    <td>{invitado.menuPrincipalTipoEspecial === 'otro' && invitado.menuPrincipalTipoOtro ? `"${invitado.menuPrincipalTipoOtro}"` : ''}</td>
                    <td>{invitado.acompanante ? invitado.nombreAcompanante : 'Sin acompañante'}</td>
                    <td>
                      {invitado.acompanante
                        ? (invitado.menuAcompananteTipo === 'otro'
                            ? invitado.menuAcompananteTipoOtro
                            : `${invitado.menuAcompananteTipo || ''} ${invitado.menuAcompananteTipoEspecial ? `(${invitado.menuAcompananteTipoEspecial})` : ''}`)
                        : 'N/A'}
                    </td>
                    <td>{invitado.menuAcompananteTipoEspecial === 'otro' && invitado.menuAcompananteTipoOtro ? `"${invitado.menuAcompananteTipoOtro}"` : ''}</td>
                    <td>
                      {invitado.hijosDetalles.map((hijo, hijoIndex) => (
                        <div key={hijoIndex}>
                          {`${hijo.nombre}: ${hijo.tipoMenu}${hijo.menuEspecial ? ` (${hijo.menuEspecialTipo}${hijo.menuEspecialTipo === 'otro' ? `: ${hijo.menuEspecialTipoOtro}` : ''})` : ''}`}
                        </div>
                      ))}
                    </td>
                    <td>{invitado.opcionTransporte}</td>
                  </tr>
                  {index < invitados.length - 1 && <tr style={{ height: '10px', background: '#eee' }}><td colSpan={9}></td></tr>}
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
    </div>
  );
};

export default VerInvitados;
