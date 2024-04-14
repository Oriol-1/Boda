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
      <p className={styles.title}>¡Vuestra asistencia ya es un regalazo! Pero si aún así queréis hacernos un pequeño obsequio y no se os ocurre nada... os proponemos una idea: nos haría mucha ilusión recibir una ayudita para la luna de miel que tanto deseamos.</p>
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
