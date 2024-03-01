import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './Fecha.module.css';

interface CountdownValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface InvitationProps {
    countdown: CountdownValues;
    weddingDate: Date;
}

const Invitation: React.FC<InvitationProps> = ({ countdown, weddingDate }) => {
    const { days, hours, minutes, seconds } = countdown;
    // Formatea la fecha de la boda utilizando date-fns y el locale español
    const formattedWeddingDate = format(weddingDate, 'PPPP', { locale: es });

    // Estado para controlar la renderización del cliente
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Marca el componente como montado en el cliente
        setIsClient(true);
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.countdownSection}>
                <h1>¡Nuestro Gran Día!</h1>
                <p>Únete a nosotros para celebrar nuestro amor el {formattedWeddingDate}.</p>
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

export default Invitation;
