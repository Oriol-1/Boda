'use client';
import React, { useEffect, useRef } from 'react';
import styles from './timelineBoda.module.css';
import { IconosEvento } from './icons';
import Image from 'next/image';

interface EventoBoda {
  hora: string;
  titulo: string;
  descripcion: string;
  tipo: keyof typeof IconosEvento;
  imageUrl?: string;
}

const TimelineBoda: React.FC = () => {
  const eventos: EventoBoda[] = [
    { hora: '11:30 ', titulo: 'Bienvenida', descripcion: 'Recepción de invitados en el jardín.', tipo: 'Bienvenida' },
    { hora: '12:00 ', titulo: 'Ceremonia', descripcion: 'Nos damos el sí 🥰', tipo: 'Ceremonia' },
    { hora: '13:00 ', titulo: 'Cóctel en el jardín', descripcion: ' Picoteo 🥂', tipo: 'Aperitivo' },
    { hora: '15:00 ', titulo: 'Banquete', descripcion: 'A comer y disfrutar 🍽️🍰 ', tipo: 'Banquete' },
    { hora: '17:30 PM', titulo: 'Baile', descripcion: '¡Que suene la música! 🎶', tipo: 'Baile' },
  ];

  const eventoRefs = useRef<(HTMLDivElement | null)[]>(new Array(eventos.length).fill(null));

  useEffect(() => {
    const currentRefs = [...eventoRefs.current];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            entry.target.classList.remove(styles.visible);
          }
        });
      },
      { rootMargin: '0px', threshold: 0.8 }
    );

    currentRefs.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      currentRefs.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.timelineContainer}>
        <div className={styles.timeline}>
          <div className={styles.lineaCentral}></div>
          {eventos.map((evento, index) => (
            <div
              key={index}
              ref={(el) => (eventoRefs.current[index] = el)}
              className={`${styles.evento} ${index % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.iconoYHora}>
                <div className={styles.icono}>
                  {IconosEvento[evento.tipo]()}
                </div>
                <div className={styles.hora}>{evento.hora}</div>
              </div>
              <div className={styles.detalle}>
                <div className={styles.titulo}>{evento.titulo}</div>
                <div className={styles.descripcion}>{evento.descripcion}</div>
              </div>
              <div className={styles.conector}></div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.imageContainer}>
        {/* Asegúrate de ajustar la ruta y dimensiones de la imagen según tus necesidades */}
        <div style={{ position: 'relative', width: '500px', height: '931px' }}>
      <Image src="/foto_lado.jpg" alt="Descripción" fill sizes='cover' style={{ objectFit: 'cover' }} />
    </div>
      </div>
    </div>
  );
};

export default TimelineBoda;
