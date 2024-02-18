import Image from 'next/image'
import Header from './ui/Header'
import FormularioPage from './../pages/formulario/index'
import PrimeraParte from './componets/primeraParte/primeraParte'

export default function Home() {
  return (
    <main>
      <div>
        <Header />
        <PrimeraParte />
    <br></br>

        <FormularioPage />
      
      </div>
    </main>
  )
}
