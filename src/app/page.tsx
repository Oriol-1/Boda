import Image from 'next/image'
import Header from './ui/Header'
import FormularioPage from './../pages/formulario/index'

export default function Home() {
  return (
    <main>
      <div>
        <Header />
        <FormularioPage />
      
      </div>
    </main>
  )
}
