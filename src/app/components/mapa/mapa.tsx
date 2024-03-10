'use client';
import React from 'react';
import Image from 'next/image';
import styles from './mapa.module.css';

const WeddingMap: React.FC = () => {
    return (
        <div className={styles.container}>

            <div className={styles.section}>
                <div className={styles.infoSection}>
                    <h2>Dirección del Evento</h2>
                    <p>Carrer del Mil·lenari de Catalunya, 29, 08530 La Garriga, Barcelona</p>
                    <p>Hora de llegada: 11:30</p>
                    <div className={styles.imageSection}>
                        <Image src="/Masia-linea1.png"
                            alt="Decoración Izquierda"
                            fill sizes="(max-width: 800px)"
                        />
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.mapSection}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11920.472840167846!2d2.2830373!3d41.6747904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4c500966c58cd%3A0x267b2e20e0d9ad9!2sMasia%20Ca%20N&#39;Illa!5e0!3m2!1ses!2ses!4v1710091950675!5m2!1ses!2ses" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
    );
};

export default WeddingMap;
