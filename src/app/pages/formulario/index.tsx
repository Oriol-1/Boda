"use client"
import React, { useState } from 'react';
import './styles.css';

export const config = { runtime: 'client' };

interface SpecialMenuSelection {
  type: string;
  customType?: string;  // Campo adicional para el tipo de menú personalizado
}

interface GuestFormState {
  name: string;
  hasCompanion: boolean;
  companionName: string;
  hasChildren: boolean;
  childrenCount: number;
  hasFoodAllergy: boolean;
  allergyDetails: string;
  specialMenuAdults: SpecialMenuSelection[];
  specialMenuChildren: SpecialMenuSelection[];
}

export default function FormularioPage() {
  const [showForm, setShowForm] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [declinerName, setDeclinerName] = useState('');
  const [goodbyeMessage, setGoodbyeMessage] = useState('');

  const handleAccept = () => {
    setShowForm(true);
    setShowInput(false);
    setGoodbyeMessage('');
  };

  const handleDecline = () => {
    setShowForm(false);
    setShowInput(true);
    setGoodbyeMessage('');
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoodbyeMessage(`Lamentamos que no puedas asistir a la boda, <span class="boldText">${declinerName}</span>. Te enviamos un abrazo.`);
    setShowInput(false);
  };

  return (
    <div className="page">
      <h1 className="heading">Formulario de Invitación a la Boda</h1>
      {!showForm && !showInput && !goodbyeMessage && (
        <div>
          <button className="button" onClick={handleAccept}>Ir a la Boda</button>
          <button className="button" onClick={handleDecline}>No Puedo Ir a la Boda</button>
        </div>
      )}

      {showForm && <WeddingInvitationForm />}
      {showInput && (
        <form onSubmit={handleDeclineSubmit} className="form">
          <input
            className="input"
            type="text"
            value={declinerName}
            onChange={(e) => setDeclinerName(e.target.value)}
            placeholder="Nombre y Apellido"
          />
          <button className="button" type="submit">Enviar</button>
        </form>
      )}
      {goodbyeMessage && (
        <p className="greenMessage" dangerouslySetInnerHTML={{ __html: goodbyeMessage }}></p>
      )}
    </div>
  );
}

function WeddingInvitationForm() {
  const [guest, setGuest] = useState<GuestFormState>({
    name: '',
    hasCompanion: false,
    companionName: '',
    hasChildren: false,
    childrenCount: 0,
    hasFoodAllergy: false,
    allergyDetails: '',
    specialMenuAdults: [],
    specialMenuChildren: [],
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setGuest(prev => ({ ...prev, [name as keyof GuestFormState]: !prev[name as keyof GuestFormState] }));
    } else if (name === 'specialMenuAdultsCount') {
      const menus = Array.from({ length: Number(value) }, () => ({ type: '', customType: '' }));
      setGuest(prev => ({ ...prev, specialMenuAdults: menus }));
    } else if (name === 'specialMenuChildrenCount') {
      const menus = Array.from({ length: Number(value) }, () => ({ type: '', customType: '' }));
      setGuest(prev => ({ ...prev, specialMenuChildren: menus }));
    } else {
      setGuest(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuTypeChange = (index: number, adult: boolean, value: string) => {
    const updatedMenus = adult ? [...guest.specialMenuAdults] : [...guest.specialMenuChildren];
    if (value === 'otro') {
      updatedMenus[index] = { type: value, customType: '' };
    } else {
      updatedMenus[index] = { type: value };
    }
    setGuest({
      ...guest,
      [adult ? 'specialMenuAdults' : 'specialMenuChildren']: updatedMenus
    });
  };

  const handleCustomMenuTypeChange = (index: number, adult: boolean, value: string) => {
    const updatedMenus = adult ? [...guest.specialMenuAdults] : [...guest.specialMenuChildren];
    updatedMenus[index].customType = value;
    setGuest({
      ...guest,
      [adult ? 'specialMenuAdults' : 'specialMenuChildren']: updatedMenus
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(guest); // Lógica de envío aquí
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">Nombre y Apellido</label>
      <input className="input" type="text" name="name" value={guest.name} onChange={handleChangeInput} placeholder="Nombre y Apellido" />

      {/* Aceptar Acompañante */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasCompanion" checked={guest.hasCompanion} onChange={handleChangeInput} />
          <span className="label-text">Acompañante</span>
        </label>
        {guest.hasCompanion && (
          <>
            <input className="input" type="text" name="companionName" value={guest.companionName} onChange={handleChangeInput} placeholder="Nombre y Apellido del Acompañante" />
            <div className="checkbox-section">
              <label className="label">
                <span className="label-text">Cantidad de Menús Especiales para Adultos</span>
              </label>
              <input 
                className="input" 
                type="number" 
                name="specialMenuAdultsCount" 
                value={guest.specialMenuAdults.length} 
                onChange={handleChangeInput} 
                min="0"
                max="2"
              />
              {guest.specialMenuAdults.map((menu, index) => (
                <div key={`adult-menu-${index}`}>
                  <select 
                    className="input"
                    value={menu.type}
                    onChange={(e) => handleMenuTypeChange(index, true, e.target.value)}
                  >
                    <option value="">Tipo de Menú Especial</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="celiaco">Celiaco</option>
                    <option value="otro">Otro</option>
                  </select>
                  {menu.type === 'otro' && (
                    <input
                      className="input"
                      type="text"
                      value={menu.customType || ''}
                      onChange={(e) => handleCustomMenuTypeChange(index, true, e.target.value)}
                      placeholder="Especificar Tipo de Menú"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Ir con Niños */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasChildren" checked={guest.hasChildren} onChange={handleChangeInput} />
          <span className="label-text">Ir con Niños</span>
        </label>
        {guest.hasChildren && (
          <>
            <input className="input" type="number" name="childrenCount" value={guest.childrenCount} onChange={handleChangeInput} placeholder="Cantidad de Niños" />
            <div className="checkbox-section">
              <label className="label">
                <span className="label-text">Cantidad de Menús Especiales para Niños</span>
              </label>
              <input 
                className="input" 
                type="number" 
                name="specialMenuChildrenCount" 
                value={guest.specialMenuChildren.length} 
                onChange={handleChangeInput} 
                min="0"
                max={guest.childrenCount}
              />
              {guest.specialMenuChildren.map((menu, index) => (
                <div key={`child-menu-${index}`}>
                  <select 
                    className="input"
                    value={menu.type}
                    onChange={(e) => handleMenuTypeChange(index, false, e.target.value)}
                  >
                    <option value="">Tipo de Menú Especial</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="celiaco">Celiaco</option>
                    <option value="otro">Otro</option>
                  </select>
                  {menu.type === 'otro' && (
                    <input
                      className="input"
                      type="text"
                      value={menu.customType || ''}
                      onChange={(e) => handleCustomMenuTypeChange(index, false, e.target.value)}
                      placeholder="Especificar Tipo de Menú"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Alergias Alimentarias */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasFoodAllergy" checked={guest.hasFoodAllergy} onChange={handleChangeInput} />
          <span className="label-text">Alergias Alimentarias</span>
        </label>
        {guest.hasFoodAllergy && (
          <input className="input" type="text" name="allergyDetails" value={guest.allergyDetails} onChange={handleChangeInput} placeholder="Detalles de la Alergia Alimentaria" />
        )}
      </div>

      {/* Botón de Enviar */}
      <button className="button" type="submit">Aceptar Invitación</button>
    </form>
  );
}
