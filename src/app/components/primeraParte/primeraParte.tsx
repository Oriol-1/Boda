'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './primera.module.css';

const PrimeraParte: React.FC = () => {
    const textoAnuncioRef = useRef<HTMLDivElement>(null);
    const [detenerTexto, setDetenerTexto] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
            const opacity = Math.min(1, scrollY / totalScrollHeight);

            const imageColor = document.querySelector('.' + styles['image-color']) as HTMLElement;

            if (imageColor) {
                imageColor.style.opacity = `${opacity}`;
            }

            if (textoAnuncioRef.current) {
                const textoAnuncioBottom = textoAnuncioRef.current.offsetTop + textoAnuncioRef.current.clientHeight;

                if (scrollY >= textoAnuncioBottom && !detenerTexto) {
                    setDetenerTexto(true);
                    textoAnuncioRef.current.style.position = 'absolute';
                    textoAnuncioRef.current.style.top = `${textoAnuncioBottom}px`;
                } else if (scrollY < textoAnuncioBottom && detenerTexto) {
                    setDetenerTexto(false);
                    textoAnuncioRef.current.style.position = 'fixed';
                    textoAnuncioRef.current.style.top = '50%';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [detenerTexto]);

    return (
        <div className={styles.container}>
            <div className={styles['texto-anuncio']} ref={textoAnuncioRef}>
    <div className={styles['decoracion-izquierda']}>
        <Image src="/inferior.png" alt="Decoración Izquierda"
            priority
            width={400}
            height={206}
        />
    </div>
        <div className={styles['texto-contenido']}> {/* Nuevo div para el texto con degradado */}
        <h1 className={styles.tituloPrincipal}>NOS CASAMOS</h1>
    <h2 className={styles.subtitulo}>Sandra & Oriol</h2>
    {/* <p className={styles.invitacion}>Celebrad con nosotros<br />este momento inolvidable</p> */}
        </div>
        <div className={styles['decoracion-derecha']}>
            <Image src="/superior.png" alt="Decoración Derecha"
                priority
                fill sizes="(max-width: 768px) 100px, 200px"
            />
        </div>
    </div>
            <div className={styles['image-bw']}>
                <Image src="/masia1.jpg" alt="Imagen en Blanco y Negro" fill priority />
            </div>
            <div className={styles['image-color']}>
                <Image src="/masia-color6.jpg" alt="Imagen a Color" fill />
            </div>
        </div>
    );
};

export default PrimeraParte;
