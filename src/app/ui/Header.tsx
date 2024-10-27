"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['buses', 'fecha Boda', 'regalos', 'horas', 'mapa'];
      // const sections = ['formulario', 'fecha Boda', 'regalos', 'horas', 'mapa', 'buses'];
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

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const linkClass = (sectionId: string) => {
    return `cursor-pointer px-3 py-2 text-sm font-sans font-medium ${
      currentSection === sectionId
        ? 'text-[#DAA520] font-bold underline decoration-[#DAA520] underline-offset-4'
        : 'text-gray-900 hover:text-gray-800'}`;
  };

  return (
    <header className="bg-white w-full fixed top-0 left-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 w-full">
          <div className="flex-shrink-0 flex items-center mt-2">
            <a onClick={handleLogoClick} className="cursor-pointer">
              <Image src="/Logo.png" alt="Logo" width={100} height={100} style={{ width: '90px', height: 'auto', margin:'10px' }} />
            </a>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white absolute top-full right-0 mr-2 mt-2 shadow-md`}>
            <div className="flex flex-col bg-white rounded-md shadow-lg overflow-hidden">
              {['buses', 'fecha Boda', 'regalos', 'horas', 'mapa'].map((section) => (
                //  {['formulario', 'fecha Boda','regalos', 'horas', 'mapa', 'buses'].map((section) => (
                <a key={section} onClick={() => handleScrollToSection(section)} className={`${linkClass(section)} block py-2 px-4 hover:bg-gray-100`}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
            </div>
          </nav>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {['buses', 'fecha Boda', 'regalos', 'horas', 'mapa'].map((section) => (
              //  {['formulario', 'fecha Boda', 'regalos', 'horas', 'mapa', 'buses'].map((section) => (
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
