// import Image from 'next/image'
import Header from './ui/Header'
import PrimeraParte from './components/primeraParte/primeraParte'
import FormularioPage from './../pages/formulario/index'
import FechaBodaPage from './../pages/fechaBoda/fechaBoda'
import LiniDeTiempo from '@/pages/liniaTiempo'




export default function Home() {
  return (

    <main>
      <div>
        <Header />
        <PrimeraParte />
    <br></br>
   
        <FormularioPage />
        <FechaBodaPage />
        <LiniDeTiempo />
  
      
      </div>
    </main>

 
  )
}
