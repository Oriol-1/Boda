import React from 'react';
import Image from 'next/image';

// Define la base URL para los iconos almacenados en la carpeta public
const baseURL = '/icons';

// Ejemplo de cómo exportar componentes de iconos que usan <Image> para mostrar GIFs animados desde la carpeta public
export const IconosEvento = {
    Bienvenida: () => (
        <Image src="/icons/bienvenida.gif" alt="Bienvenida" width={70} height={70} priority unoptimized />
    ),
    Ceremonia: () => (
        <Image src="/icons/Ceremonia.gif" alt="Ceremonia" width={70} height={70} priority unoptimized />
    ),
    Aperitivo: () => (
        <Image src="/icons/Aperitivo.gif" alt="Aperitivo" width={70} height={70} priority unoptimized />
    ),
    Banquete: () => (
        <Image src="/icons/Banquete.gif" alt="Banquete" width={70} height={70} priority unoptimized />
    ),
    Baile: () => (
        <Image src="/icons/Baile.gif" alt="Baile" width={70} height={70} priority unoptimized />
    ),
};

// O simplemente exportar las rutas si prefieres manejar el <img> directamente en el componente que usa el icono
export const iconPaths = {
  Ceremonia: `${baseURL}/Ceremonia.svg`,
  Recepcion: `${baseURL}/Recepcion.svg`,
  Cena: `${baseURL}/Cena.svg`,
  Baile: `${baseURL}/Baile.svg`,
};
