// import Image from 'next/image'
import React from 'react';

import Header from './ui/Header'
import PrimeraParte from './components/primeraParte/primeraParte'
import FormularioPage from './../pages/formulario/index'
import FechaBodaPage from './../pages/fechaBoda/fechaBoda'
import LiniDeTiempo from '@/pages/liniaTiempo'
import ElMapa from '@/pages/elMapa/elMapa'
import PaginaRegalo from '@/pages/regalos';
import BusRoutePage from '@/pages/buses';
import './globals.css'


export default function Home() {
  return (
    <main>
      <div>
        <Header />
      
        {/* Cada sección ahora tiene un ID que puede ser utilizado para el desplazamiento suave */}
        <div id="primeraParte">
        
          <PrimeraParte />
        </div>
        <br></br>
        <div id="buses">
          <BusRoutePage />
        </div>
        
        {/* <div id="formulario">
          <FormularioPage />
        </div> */}
        <div id="fecha Boda">
          <FechaBodaPage />
        </div>
        <div id="regalos">
          <PaginaRegalo />
        </div>
        <div id="horas">
          <LiniDeTiempo />
        </div>
        <div id="mapa">
          <ElMapa />
        </div>
      
      </div>
    </main>
  );
}