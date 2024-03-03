'use client';
import React, { useEffect, useRef } from 'react';
import styles from './timelineBoda.module.css';
import { IconosEvento } from './icons';

const TimelineBoda = () => {
    const eventos = [
      { hora: '12:00 PM', titulo: 'Bienvenida', descripcion: 'Recepción de invitados en el jardín.', tipo: 'Bienvenida' },
      { hora: '1:00 PM', titulo: 'Ceremonia', descripcion: 'Ceremonia religiosa en la iglesia.', tipo: 'Ceremonia' },
      { hora: '2:00 PM', titulo: 'Aperitivo', descripcion: 'Aperitivo y cóctel en el jardín.', tipo: 'Aperitivo' },
      { hora: '3:00 PM', titulo: 'Banquete', descripcion: 'Banquete en el salón de eventos.', tipo: 'Banquete' },
      { hora: '8:00 PM', titulo: 'Baile', descripcion: 'Baile y fiesta en el salón.', tipo: 'Baile' },
    ];

    const eventoRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
      // Copia la referencia actual a una variable local dentro del efecto
      const currentRefs = eventoRefs.current;
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add(styles.visible);
            } else {
              entry.target.classList.remove(styles.visible);
            }
          });
        },
        { rootMargin: '0px', threshold: 0.1 }
      );
  
      currentRefs.forEach(el => {
        if (el) observer.observe(el);
      });
  
      // Limpieza usando la variable local
      return () => currentRefs.forEach(el => {
        if (el) observer.unobserve(el);
      });
  }, []);

    return (
      <div className={styles.timeline}>
        <div className={styles.linea}></div>
        {eventos.map((evento, index) => (
          <div key={index} ref={el => eventoRefs.current[index] = el} className={styles.evento}>
            <div className={styles.conector}></div>
            <div className={styles.icono}>
            {IconosEvento[evento.tipo as keyof typeof IconosEvento]()}
            </div>
            <div className={styles.detalle}>
              <div className={styles.hora}>{evento.hora}</div>
              <div className={styles.titulo}>{evento.titulo}</div>
              <div className={styles.descripcion}>{evento.descripcion}</div>
            </div>
          </div>
        ))}
      </div>
    );
};

export default TimelineBoda;
