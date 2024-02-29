import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Asegúrate de incluir los estilos de react-calendar
import useCountdown from '../../../app/libs/useCountdown'; // Ajusta la ruta según la ubicación real de tu hook
import styles from './Fecha.module.css'; // Asume que los estilos están en este archivo CSS module

interface FechaBodaPageProps {
  weddingDate: Date;
}

const FechaBodaPage: React.FC<FechaBodaPageProps> = ({ weddingDate }) => {
  const [isClient, setIsClient] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(weddingDate.getTime());

  // Señal para renderizar componentes dependientes del cliente después de la montura
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.countdownSection}>
        <h1>¡Nuestro Gran Día!</h1>
        <p>Únete a nosotros para celebrar nuestro amor el {weddingDate.toLocaleDateString()}.</p>
        <div className={styles.countdown}>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{days}</span>
            <span>Días</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{hours}</span>
            <span>Horas</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{minutes}</span>
            <span>Minutos</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{seconds}</span>
            <span>Segundos</span>
          </div>
        </div>
      </section>
      {isClient && (
        <div className={styles.calendarContainer}>
          <Calendar
            value={weddingDate}
            tileClassName={({ date, view }) => {
              if (date.getDate() === weddingDate.getDate() &&
                  date.getMonth() === weddingDate.getMonth() &&
                  date.getFullYear() === weddingDate.getFullYear()) {
                return styles.highlightDay;
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FechaBodaPage;