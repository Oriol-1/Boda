"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="flex justify-between items-center h-16 w-full">
       
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">Boda
              </Link>
            </div>

            {/* Navegación para pantallas grandes */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/nosotros"className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">Nosotros</Link>
              <Link href="/servicios" className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">Servicios</Link>
              <Link href="/contacto"className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">Contacto</Link>
              <Link href="/reserva"className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">Reservar Visita</Link>
            </div>
    

          {/* Menú hamburguesa para pantallas pequeñas */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono del menú */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              {/* Icono de cerrar */}
              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú para pantallas pequeñas */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/nosotros" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Nosotros</Link>
          <Link href="/servicios" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Servicios</Link>
          <Link href="/contacto" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Contacto</Link>
          <Link href="/reserva" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Reservar Visita</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
