// import Image from 'next/image'
import Header from './ui/Header'
import PrimeraParte from './componets/primeraParte/primeraParte'
import FormularioPage from './../pages/formulario/index'
import FechaBodaPage from './../pages/fechaBoda/fechaBoda'




export default function Home() {
  return (

    <main>
      <div>
        <Header />
        <PrimeraParte />
    <br></br>
   
        <FormularioPage />
        <FechaBodaPage />
  
      
      </div>
    </main>

 
  )
}
