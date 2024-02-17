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
                <Image src="/masia.jpg" alt="Imagen en Blanco y Negro" layout="fill" objectFit="cover" />
            </div>
            <div className={styles['image-color']}>
                <Image src="/masia-color3.jpg" alt="Imagen a Color" layout="fill" objectFit="cover" />
            </div>
            <div className={styles['nosotros-image']}>
                <Image src="/nosotros.png" alt="Nosotros" layout="responsive" width={300} height={200} />
            </div>
        </div>
    );
};

export default PrimeraParte;
