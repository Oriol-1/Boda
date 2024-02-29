import { useState, useEffect, useCallback } from 'react';

// Define una interfaz para los valores de retorno de `useCountdown`
interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const useCountdown = (targetDate: number): CountdownValues => {
  // Usa `useCallback` para `calculateTimeLeft` para evitar la re-creación de la función
  const calculateTimeLeft = useCallback((): number => {
    const now = new Date().getTime();
    const difference = new Date(targetDate).getTime() - now;
    return Math.max(difference, 0); // Asegura que el tiempo restante no sea negativo
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

  useEffect(() => {
    // Actualiza `timeLeft` cada segundo
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Limpieza al desmontar el componente
    return () => clearInterval(interval);
  }, [calculateTimeLeft]); // `calculateTimeLeft` está incluida como dependencia

  // Desglosa `timeLeft` en días, horas, minutos y segundos
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Retorna un objeto con los valores calculados
  return { days, hours, minutes, seconds };
};

export default useCountdown;
