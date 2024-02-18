'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './primera.module.css';

const PrimeraParte: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const nosotrosImage = document.querySelector('.' + styles['nosotros-image']) as HTMLElement;
        const imageColor = document.querySelector('.' + styles['image-color']) as HTMLElement;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
            const opacity = Math.min(1, scrollY / totalScrollHeight);

            // Ajustar la opacidad de la imagen a color
            if (imageColor) {
                imageColor.style.opacity = `${opacity}`;
            }

            // Animación de la imagen 'nosotros-image'
            if (scrollY > scrollPosition) {
                // Scroll hacia abajo
                nosotrosImage.style.transform = 'translate(-50%, 0) scale(1)';
                nosotrosImage.style.bottom = '-90px'; // Posición final
                nosotrosImage.style.opacity = '1';
            } else {
                // Scroll hacia arriba
                nosotrosImage.style.transform = 'translate(-50%, 50%) scale(1.5)';
                nosotrosImage.style.bottom = '50%'; // Posición inicial en el centro
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
            <div className={styles['image-bw']}>
                <Image src="/masia1.jpg" alt="Imagen en Blanco y Negro" fill priority />
            </div>
            <div className={styles['image-color']}>
                <Image src="/masia-color4.jpg" alt="Imagen a Color" fill />
            </div>
            <div className={styles['nosotros-image']}>
                <Image src="/nosotros1.png" alt="Nosotros" fill sizes="50vw" />
            </div>
        </div>
    );
};

export default PrimeraParte;
