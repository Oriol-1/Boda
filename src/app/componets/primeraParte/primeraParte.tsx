
'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './primera.module.css';

const PrimeraParte: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
            const opacity = Math.min(1, scrollY / totalScrollHeight);

            const imageColor = document.querySelector('.' + styles['image-color']) as HTMLElement;
            const textoAnuncio = document.querySelector('.' + styles['texto-anuncio']) as HTMLElement;
            const nosotrosImage = document.querySelector('.' + styles['nosotros-image']) as HTMLElement;

            if (imageColor) {
                imageColor.style.opacity = `${opacity}`;
            }

            if (scrollY > scrollPosition) {
                textoAnuncio.style.transform = 'translate(-50%, -10%)';
                textoAnuncio.style.bottom = '10%';
                textoAnuncio.style.opacity = '1';

                nosotrosImage.style.transform = 'translate(-50%, 0) scale(1)';
                nosotrosImage.style.bottom = '-50px';
                nosotrosImage.style.opacity = '1';
            } else {
                textoAnuncio.style.transform = 'translate(-50%, -50%)';
                textoAnuncio.style.bottom = '50%';
                textoAnuncio.style.opacity = '1';

                nosotrosImage.style.transform = 'translate(-50%, 50%) scale(1.5)';
                nosotrosImage.style.bottom = '40%';
                nosotrosImage.style.opacity = '0';
            }

            setScrollPosition(scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollPosition]);
    return (
        <div className={styles.container}>
            {/* Contenedor para el texto de la invitación y las imágenes decorativas */}
            <div className={styles['texto-anuncio']}>
                {/* Imagen decorativa a la izquierda */}
                <div className={styles['decoracion-izquierda']}>
                <Image src="/shape-1.png" alt="Decoración Izquierda" fill sizes="(max-width: 768px) 100px, 200px" />
</div>

                {/* Texto de la invitación */}
                <div>
                    <h1>NOS CASAMOS</h1>
                    <h2>Sandra & Oriol</h2>
                    <p>¿Te vienes a la fiesta?</p>
                </div>

                {/* Imagen decorativa a la derecha */}
                <div className={styles['decoracion-derecha']}>
                <Image src="/shape-2.png" alt="Decoración Derecha" fill sizes="(max-width: 768px) 100px, 200px" />
</div>
            </div>

            {/* Resto de elementos como las imágenes de fondo */}
            <div className={styles['image-bw']}>
                <Image src="/masia1.jpg" alt="Imagen en Blanco y Negro" fill priority />
            </div>
            <div className={styles['image-color']}>
                <Image src="/masia-color6.jpg" alt="Imagen a Color" fill />
            </div>
            <div className={styles['nosotros-image']}>
                <Image src="/nosotros1.png" alt="Nosotros" fill sizes="50vw" />
            </div>
        </div>
    );
};
export default PrimeraParte;
