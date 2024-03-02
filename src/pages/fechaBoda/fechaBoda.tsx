'use client';

import React from 'react';
import useCountdown from '../../app/libs/useCountdown';
import Invitation from '../../app/componets/fecha/Fecha'; // Corregido a 'components'
import './stylesFech.css'

const FechaBodaPage = () => {
  const weddingDate = new Date('2024-11-01');
  const countdown = useCountdown(weddingDate.getTime());

  return (
    <div className="container">
      <Invitation countdown={countdown} weddingDate={weddingDate} />
    </div>
  );
};

export default FechaBodaPage;