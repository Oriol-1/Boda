import React from 'react';
import Image from 'next/image';
import styles from './BusTimeline.module.css'; // Asegúrate de que la ruta es correcta

const BusTimeline = () => {
  const stops = [
    { name: "Estació d'Autobusos de Fabra i Puig", time: "Llegada a las 9:30", key: "fabra-i-puig" },
    { name: "Carrer de Lluís Companys, 2, 08290 Cerdanyola del Vallès, Barcelona", time: "Llegada a las 10:30", key: "lluís-companys" },
    { name: "Carrer del Mil·lenari de Catalunya, 29, 08530 La Garriga, Barcelona", time: "Llegar a las 11:15", key: "mil-lenari" }
  ];

  return (
    <div className={styles.container}>
      <p className={styles.title1}>Ruta del Bus</p>
      <div className={styles.busTimelineContainer}>
        {stops.map((stop, index) => (
          <div key={stop.key} className={`${styles.stop} ${index === stops.length - 1 ? styles.last : ''}`}>
            <div style={{ position: 'relative', width: '69px', height: '70px' }}>
            <div className={styles.iconContainer}> 
  <Image
  src="/icono-bus.png"
  alt="Icono del Bus"
  // Removido layout="fill"
  // Usa un enfoque de estilo para 'objectFit'
  style={{ objectFit: 'cover' }}
  width={69} // Especifica el ancho si es conocido
  height={70} // Especifica la altura si es conocida
 

  />
  </div>
</div>
            <div className={styles.stopInfo}>
              <div className={styles.stopName}>{stop.name}</div>
              <div className={styles.stopTime} style={{fontWeight: 'bold'}}>{stop.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.mapContainer}>
        {/* Asegúrate de que el contenedor tenga posición relativa para trabajar con fill */}
        <Image
  src="/buss.png"
  alt="Bus Route Map"
  width={768} // Ancho original de la imagen
  height={432} // Alto original de la imagen, ajustado para mantener la relación de aspecto
  style={{ objectFit: 'cover' }}
 

/>
      </div>
    </div>
  );
};

export default BusTimeline;