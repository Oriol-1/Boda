import React, { useState } from 'react';
import Image from 'next/image';
import styles from './regalo.module.css'; // Asegúrate de que el nombre coincida con el archivo CSS

const Regalo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.wrapper}>
     <p className={styles.title1}>Regalo para los Novios</p>
      <div className={styles.imageContainer}>
      <Image
  src="/regalo.png"
  alt="Regalo"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
      </div>
      <p className={styles.title}>Si quieres hacernos un regalo y no se te ocurre nada, te proponemos una idea: ayudarnos con nuestro viaje de luna de miel. Sería un detalle genial y muy práctico que seguro recordaremos siempre.</p>
      <button className={styles.button} onClick={toggleModal}>Regalo</button>
      {isModalOpen && (
        <div className={styles.modal}>
          <p className={styles.modalText}>Número de cuenta: XXXX-XXXX-XXXX-XXXX</p>
          <button className={styles.closeButton} onClick={toggleModal}>Cerrar</button>
         
        </div>
      )}
    </div>
  );
};

export default Regalo;
