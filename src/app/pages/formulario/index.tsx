"use client"
import React, { useEffect, useState } from 'react';
import './styles.css';

interface SpecialMenuSelection {
  type: string;
  customType?: string;
}

interface ChildWithMenuType {
  name: string;
  menuType: 'infantil' | 'adulto';
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
  childrenDetails: ChildWithMenuType[];
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
    childrenDetails: [],
  });

  const [specialAdultMenuCount, setSpecialAdultMenuCount] = useState(0);
  const [specialChildMenuCount, setSpecialChildMenuCount] = useState(0);

  useEffect(() => {
    let adultMenuCount = 1; // Contar siempre el invitado principal
    if (guest.hasCompanion && guest.companionName.trim() !== '') {
      adultMenuCount += 1; // Añadir por el acompañante
    }

    let childMenuCount = 0;
    guest.childrenDetails.forEach(child => {
      if (child.menuType === 'adulto') {
        adultMenuCount += 1; // Añadir por niño con menú adulto
      } else if (child.menuType === 'infantil') {
        childMenuCount += 1; // Añadir por niño con menú infantil
      }
    });

    setSpecialAdultMenuCount(adultMenuCount);
    setSpecialChildMenuCount(childMenuCount);
  }, [guest]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setGuest(prev => ({ ...prev, [name]: newValue }));
  };

  const handleMenuTypeChange = (index: number, adult: boolean, value: string) => {
    const updatedMenus = adult ? [...guest.specialMenuAdults] : [...guest.specialMenuChildren];
    updatedMenus[index] = { type: value, customType: updatedMenus[index].customType };
    setGuest(prev => ({ ...prev, [adult ? 'specialMenuAdults' : 'specialMenuChildren']: updatedMenus }));
  };

  const handleCustomMenuTypeChange = (index: number, adult: boolean, value: string) => {
    const updatedMenus = adult ? [...guest.specialMenuAdults] : [...guest.specialMenuChildren];
    updatedMenus[index].customType = value;
    setGuest(prev => ({ ...prev, [adult ? 'specialMenuAdults' : 'specialMenuChildren']: updatedMenus }));
  };

  const handleChangeChildrenDetails = (index: number, field: keyof ChildWithMenuType, value: any) => {
    const newChildrenDetails = [...guest.childrenDetails];
    newChildrenDetails[index] = { ...newChildrenDetails[index], [field]: value };
    setGuest(prev => ({ ...prev, childrenDetails: newChildrenDetails }));
  };

  const handleAddChild = () => {
    setGuest(prev => ({
      ...prev,
      childrenDetails: [...prev.childrenDetails, { name: '', menuType: 'infantil' }],
    }));
  };

  const handleSpecialMenusChange = (count: number, isAdultMenu: boolean) => {
    count = Math.min(count, isAdultMenu ? specialAdultMenuCount : specialChildMenuCount);
    const newMenus = Array.from({ length: count }, () => ({ type: '', customType: '' }));

    setGuest(prevGuest => ({
      ...prevGuest,
      [isAdultMenu ? 'specialMenuAdults' : 'specialMenuChildren']: newMenus
    }));
  };

  const handleChangeChildrenCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    setGuest(prev => {
      const updatedChildrenDetails = prev.childrenDetails.slice(0, newCount);
      while (updatedChildrenDetails.length < newCount) {
        updatedChildrenDetails.push({ name: '', menuType: 'infantil' });
      }
      return { ...prev, childrenCount: newCount, childrenDetails: updatedChildrenDetails };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(guest); // Envío de datos al backend
  };
return (
  <form onSubmit={handleSubmit} className="form">
    {/* Nombre y Apellido */}
    <label className="label">Nombre y Apellido</label>
    <input
      className="input"
      type="text"
      name="name"
      value={guest.name}
      onChange={handleChangeInput}
      placeholder="Nombre y Apellido"
    />

    {/* Aceptar Acompañante */}
    <div className="checkbox-section">
      <label className="label">
        <input
          type="checkbox"
          name="hasCompanion"
          checked={guest.hasCompanion}
          onChange={handleChangeInput}
        />
        <span className="label-text">Acompañante</span>
      </label>
      {guest.hasCompanion && (
        <input
          className="input"
          type="text"
          name="companionName"
          value={guest.companionName}
          onChange={handleChangeInput}
          placeholder="Nombre y Apellido del Acompañante"
        />
      )}
    </div>

    {/* Ir con Hijos */}
    <div className="checkbox-section">
        <label className="label">
          <input
            type="checkbox"
            name="hasChildren"
            checked={guest.hasChildren}
            onChange={handleChangeInput}
          />
          <span className="label-text">Ir con Hijos</span>
        </label>
        {guest.hasChildren && (
          <>
            <label className="label">Cantidad de Hijos:</label>
            <input
              className="input"
              type="number"
              name="childrenCount"
              value={guest.childrenCount}
              onChange={handleChangeChildrenCount}
              min="0"
            />

            {guest.childrenDetails.map((child, index) => (
              <div key={`child-detail-${index}`} className="child-detail">
                <input
                  className="input"
                  type="text"
                  value={child.name}
                  onChange={(e) => handleChangeChildrenDetails(index, 'name', e.target.value)}
                  placeholder="Nombre del Hijo"
                />
                <label className="label">
                  <span className="label-text">Tipo de Menú</span>
                  <select
                    className="input"
                    value={child.menuType}
                    onChange={(e) => handleChangeChildrenDetails(index, 'menuType', e.target.value)}
                  >
                    <option value="infantil">Menú Infantil</option>
                    <option value="adulto">Menú Adulto</option>
                  </select>
                </label>
              </div>
            ))}
          </>
        )}
      </div>

    {/* Alergias Alimentarias */}
    <div className="checkbox-section">
      <label className="label">
        <input
          type="checkbox"
          name="hasFoodAllergy"
          checked={guest.hasFoodAllergy}
          onChange={handleChangeInput}
        />
        <span className="label-text">Alergias Alimentarias</span>
      </label>
      {guest.hasFoodAllergy && (
        <input
          className="input"
          type="text"
          name="allergyDetails"
          value={guest.allergyDetails}
          onChange={handleChangeInput}
          placeholder="Detalles de la Alergia Alimentaria"
        />
      )}
    </div>

    {/* Menús Especiales para Adultos */}
    <div className="checkbox-section">
      <label className="label">Cantidad de Menús Especiales para Adultos</label>
      <input 
        className="input" 
        type="number" 
        name="specialMenuAdultsCount" 
        value={guest.specialMenuAdults.length} 
        onChange={(e) => handleSpecialMenusChange(Number(e.target.value), true)} 
        min="0"
      />
      {guest.specialMenuAdults.map((menu, index) => (
        <div key={`adult-menu-${index}`}>
          <select 
            className="input"
            value={menu.type}
            onChange={(e) => handleMenuTypeChange(index, true, e.target.value)}
          >
            <option value="">Seleccionar Tipo</option>
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

    {/* Menús Especiales para Niños */}
    <div className="checkbox-section">
      <label className="label">Cantidad de Menús Especiales para Niños</label>
      <input 
        className="input" 
        type="number" 
        name="specialMenuChildrenCount" 
        value={guest.specialMenuChildren.length} 
        onChange={(e) => handleSpecialMenusChange(Number(e.target.value), false)} 
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
            <option value="">Seleccionar Tipo</option>
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


    
   {/* Cálculo y muestra de cantidades de cada tipo de menú */}
   <div className="menu-summary">
        <h3>Resumen de Menús Seleccionados</h3>
        <ul>
          <li>Total Menús de Adultos: {specialAdultMenuCount}</li>
          <li>Total Menús Especiales para Adultos: {guest.specialMenuAdults.length}</li>
          <li>Total Menús Infantiles: {specialChildMenuCount}</li>
          <li>Total Menús Especiales para Niños: {guest.specialMenuChildren.length}</li>
        </ul>
      </div>

    {/* Botón de Enviar */}
    <button className="button" type="submit">Aceptar Invitación</button>
  </form>
);
}
