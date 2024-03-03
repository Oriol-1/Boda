'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './timelineBoda.module.css';
import { IconosEvento } from './icons'; // Asegúrate de que la ruta de importación sea correcta

interface EventoBoda {
  hora: string;
  titulo: string;
  descripcion: string;
  tipo: keyof typeof IconosEvento; // Asegura que el tipo coincida con las claves de IconosEvento
}

const TimelineBoda: React.FC = () => {
    const eventos: EventoBoda[] = [
      { hora: '12:00 PM', titulo: 'Bienvenida', descripcion: 'Recepción de invitados en el jardín de la casa de los novios.', tipo: 'Bienvenida' },
      { hora: '1:00 PM', titulo: 'Ceremonia', descripcion: 'Ceremonia religiosa en la iglesia de San Juan.', tipo: 'Ceremonia' },
      { hora: '2:00 PM', titulo: 'Aperitivo', descripcion: 'Aperitivo y coctel en el jardín de la casa de los novios.', tipo: 'Aperitivo' },
      { hora: '3:00 PM', titulo: 'Banquete', descripcion: 'Banquete en el salón de eventos "El jardín".', tipo: 'Banquete' },
      { hora: '8:00 PM', titulo: 'Baile', descripcion: 'Baile y fiesta en el salón de eventos "El jardín".', tipo: 'Baile' },
     
     
  
    ];

    const eventoRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
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
          { rootMargin: '0px', threshold: 0.8 }
        );

        currentRefs.forEach(el => {
          if (el) observer.observe(el);
        });

        return () => currentRefs.forEach(el => {
          if (el) observer.unobserve(el);
        });
    }, []);

    return (
      <div className={styles.timeline}>
          {eventos.map((evento, index) => (
              <div key={index} ref={el => eventoRefs.current[index] = el} className={styles.evento}>
                  <div className={styles.icono}>
                      {IconosEvento[evento.tipo]()}
                  </div>
                  <div className={styles.hora}>{evento.hora}</div>
                  <div className={styles.detalle}>
                      <div className={styles.titulo}>{evento.titulo}</div>
                      <div className={styles.descripcion}>{evento.descripcion}</div>
                  </div>
              </div>
          ))}
      </div>
  );
};

export default TimelineBoda;