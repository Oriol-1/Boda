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
}

const TimelineBoda: React.FC = () => {
  const eventos: EventoBoda[] = [
    { hora: '12:00 PM', titulo: 'Bienvenida', descripcion: 'Recepción de invitados en el jardín.', tipo: 'Bienvenida' },
    { hora: '1:00 PM', titulo: 'Ceremonia', descripcion: 'Ceremonia.', tipo: 'Ceremonia' },
    { hora: '2:00 PM', titulo: 'Aperitivo', descripcion: 'Aperitivo y cóctel en el jardín.', tipo: 'Aperitivo' },
    { hora: '3:00 PM', titulo: 'Banquete', descripcion: 'Banquete en el salón de eventos.', tipo: 'Banquete' },
    { hora: '8:00 PM', titulo: 'Baile', descripcion: 'Baile y fiesta en el salón.', tipo: 'Baile' },
  ];

  const eventoRefs = useRef<(HTMLDivElement | null)[]>(new Array(eventos.length).fill(null));

  useEffect(() => {
    // Crea una copia de la referencia actual para usar dentro de useEffect
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

    // Limpieza: desconectar el observer de todos los elementos observados usando la copia de las referencias
    return () => {
      currentRefs.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  // Asegúrate de que las dependencias estén configuradas correctamente si tu lógica lo requiere
  }, []); // Las dependencias vacías indican que el efecto se ejecuta solo en el montaje del componente

  return (
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
  );
};

export default TimelineBoda;