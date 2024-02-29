import React from 'react';
import useCountdown from '../../libs/useCountdown';
import styles from './Fecha.module.css'; // Asumiendo que decides usar CSS Modules para estilos específicos

interface InvitationProps {
  weddingDate: Date;
}

const Fecha: React.FC<InvitationProps> = ({ weddingDate }) => {
  const targetDate = weddingDate.getTime();
  const { days, hours, minutes, seconds } = useCountdown(weddingDate.getTime());

  return (
    <section className={styles.invitationSection}>
      <div className={styles.invitationContent}>
        <h1>¡El Gran Día!</h1>
        <p>Únete a nosotros para celebrar nuestro amor el {weddingDate.toLocaleDateString()}.</p>
        <div className={styles.countdown}>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{days}</span>
            <span className={styles.countdownLabel}>Días</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{hours}</span>
            <span className={styles.countdownLabel}>Horas</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{minutes}</span>
            <span className={styles.countdownLabel}>Minutos</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownTime}>{seconds}</span>
            <span className={styles.countdownLabel}>Segundos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fecha;