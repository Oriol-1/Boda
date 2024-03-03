import React from 'react';
import Image from 'next/image';

// Define la base URL para los iconos almacenados en la carpeta public
const baseURL = '/icons';

// Ejemplo de cómo exportar componentes de iconos que usan <img> para mostrar SVGs desde la carpeta public
export const IconosEvento = {
    Bienvenida: () => (
        <Image src="/icons/Bienvenida.svg" alt="Bienvenida" width={70} height={70} priority />
    ),
    Ceremonia: () => (
        <Image src="/icons/Ceremonia.svg" alt="Ceremonia" width={70} height={70} priority />
    ),
    Aperitivo: () => (
        <Image src="/icons/Aperitivo.svg" alt="Aperitivo" width={70} height={70} priority />
    ),
    Banquete: () => (
        <Image src="/icons/Banquete.svg" alt="Banquete" width={70} height={70} priority />
    ),
    Baile: () => (
        <Image src="/icons/Baile.svg" alt="Baile" width={70} height={70} priority />
    ),
};

// O simplemente exportar las rutas si prefieres manejar el <img> directamente en el componente que usa el icono
export const iconPaths = {
  Ceremonia: `${baseURL}/Ceremonia.svg`,
  Recepcion: `${baseURL}/Recepcion.svg`,
  Cena: `${baseURL}/Cena.svg`,
  Baile: `${baseURL}/Baile.svg`,
};
