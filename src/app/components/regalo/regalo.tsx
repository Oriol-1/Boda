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
      <Image src="/regalo.png" alt="Regalo" fill className={styles.responsiveImage} />
      </div>
      <p className={styles.title}>Si deseas regalarnos algo y no sabes qué, puedes ayudarnos con nuestro viaje de bodas.</p>
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
