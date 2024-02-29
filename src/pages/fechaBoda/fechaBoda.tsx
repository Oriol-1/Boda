'use client';

import React, { useState, useEffect } from 'react';
import Invitation from '../../app/componets/fecha/Fecha'; // Asegúrate de corregir la ruta si es necesario
import useCountdown from '../../app/libs/useCountdown';

const FechaBodaPage = () => {
    const weddingDate = new Date('2024-11-1').getTime();
    
    // Usa directamente useCountdown aquí, sin necesidad de useEffect o useState adicional
    const { days, hours, minutes, seconds } = useCountdown(weddingDate);
  
    return (
      <div>
        <Invitation weddingDate={new Date('2024-11-1')} />
        <div>
          {/* Quedan {days} días, {hours} horas, {minutes} minutos, y {seconds} segundos para la boda. */}
        </div>
      </div>
    );
  };
  
  export default FechaBodaPage;
