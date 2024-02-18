'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './primera.module.css';

const PrimeraParte: React.FC = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
            const opacity = Math.min(1, scrollY / totalScrollHeight);

            const imageColor = document.querySelector('.' + styles['image-color']) as HTMLElement;
            if (imageColor) {
                imageColor.style.opacity = `${opacity}`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles['image-bw']}>
                <Image src="/masia1.jpg" alt="Imagen en Blanco y Negro" fill />
            </div>
            <div className={styles['image-color']}>
                <Image src="/masia-color4.jpg" alt="Imagen a Color" fill />
            </div>
            <div className={styles['nosotros-image']}>
                <Image src="/nosotros1.png" alt="Nosotros" width={300} height={300} />
            </div>
        </div>
    );
};

export default PrimeraParte;