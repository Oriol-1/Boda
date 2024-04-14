'use client';

import React from 'react';
import useCountdown from '../../app/libs/useCountdown';
import Invitation from '../../app/components/fecha/Fecha'; // Corregido a 'components'
import './stylesFech.css'

const FechaBodaPage = () => {
  const weddingDate = new Date('2024-11-01T11:30:00'); // Hora ajustada para las 11:30 AM
  const countdown = useCountdown(weddingDate.getTime());

  return (
    <div className="container">
      <Invitation countdown={countdown} weddingDate={weddingDate} />
    </div>
    
  );
};

export default FechaBodaPage;