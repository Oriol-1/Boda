"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'formulario', 'fechaBoda', 'liniaTiempo', 'elMapa', 'buses'];
      let currentSectionId = '';

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (window.scrollY >= sectionTop - sectionHeight / 3 && window.scrollY < sectionTop + sectionHeight - sectionHeight / 3) {
            currentSectionId = sectionId;
          }
        }
      });

      setCurrentSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const linkClass = (sectionId: string) => `cursor-pointer px-3 py-2 text-sm font-medium ${
    currentSection === sectionId
      ? 'text-[#DAA520] font-bold underline decoration-[#DAA520] underline-offset-4'
      : 'text-gray-900 hover:text-gray-700'}`;

  return (
    <header className="bg-white w-full fixed top-0 left-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 w-full"> {/* Ajusté la altura aquí para asegurarme de que haya espacio para el margen */}
          <div className="flex-shrink-0 flex items-center mt-2"> {/* Añadí mt-2 para margen superior */}
            {/* Asegúrate de reemplazar los siguientes valores con los tuyos propios */}
            <a onClick={() => handleScrollToSection('inicio')} className={linkClass('inicio')}>
              <Image src="/nosotros1.png" alt="Logo" width={80} height={40} style={{ width: 'auto', height: 'auto' }} />
            </a>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                // Icono para cerrar el menú
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Icono del menú hamburguesa
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white absolute top-full left-0 right-0 w-full shadow-md`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Menú para dispositivos móviles */}
              {['formulario', 'fechaBoda', 'liniaTiempo', 'elMapa', 'buses'].map((section) => (
                <a key={section} onClick={() => handleScrollToSection(section)} className={linkClass(section)}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {/* Menú para pantallas grandes */}
            {['formulario', 'fechaBoda', 'liniaTiempo', 'elMapa', 'buses'].map((section) => (
              <a key={section} onClick={() => handleScrollToSection(section)} className={linkClass(section)}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
