'use client';

import React from 'react';
import useCountdown from '../../app/libs/useCountdown';
import Invitation from '../../app/componets/fecha/Fecha'; // Corregido a 'components'


const FechaBodaPage = () => {
  const weddingDate = new Date('2024-11-01').getTime();
  const countdown = useCountdown(weddingDate);

  return (
    <div>
      <Invitation weddingDate={new Date('2024-11-01')} />
      <div>
        {/* Quedan {countdown.days} días, {countdown.hours} horas, {countdown.minutes} minutos, y {countdown.seconds} segundos para la boda. */}
      </div>
    </div>
  );
};

export default FechaBodaPage;