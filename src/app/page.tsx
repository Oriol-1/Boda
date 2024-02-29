import Image from 'next/image'
import Header from './ui/Header'
import FormularioPage from './../pages/formulario/index'
import PrimeraParte from './componets/primeraParte/primeraParte'
import FechaBodaPage from './../pages/fechaBoda/fechaBoda'
// import styles  from './Home.module.css'



export default function Home() {
  return (
    // <section className={styles.invitationSection}>
    <main>
      <div>
        <Header />
        <PrimeraParte />
    <br></br>
   
        <FormularioPage />
        <FechaBodaPage />
    
      
     
      
      
      
      </div>
    </main>
    // </section>
 
  )
}
