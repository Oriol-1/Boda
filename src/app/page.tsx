// import Image from 'next/image'
import React from 'react';

import Header from './ui/Header'
import PrimeraParte from './components/primeraParte/primeraParte'
import FormularioPage from './../pages/formulario/index'
import FechaBodaPage from './../pages/fechaBoda/fechaBoda'
import LiniDeTiempo from '@/pages/liniaTiempo'
import ElMapa from '@/pages/elMapa/elMapa'
import PaginaRegalo from '@/pages/regalos';

export default function Home() {
  return (
    <main>
      <div>
        <Header />
        <PrimeraParte />
        <br></br>
        <FormularioPage />
        <FechaBodaPage />
        <PaginaRegalo />
        <LiniDeTiempo />
        <ElMapa />
      </div>
    </main>
  );
}