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
  menuType: 'estandar' | 'especial';
  specialMenuType: 'vegano' | 'celiaco' | 'otro';
  customMenuType: string;
  hasCompanion: boolean;
  companionName: string;
  companionMenuType: 'estandar' | 'especial';
  companionSpecialMenuType: 'vegano' | 'celiaco' | 'otro';
  companionCustomMenuType: string;
  hasChildren: boolean;
  childrenCount: number;
  childrenDetails: ChildWithMenuType[];
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
    menuType: 'estandar', // Incluye esta propiedad
    specialMenuType: 'vegano', // Incluye esta propiedad
    customMenuType: '', // Incluye esta propiedad
    hasCompanion: false,
    companionName: '',
    companionMenuType: 'estandar', // Incluye esta propiedad
    companionSpecialMenuType: 'vegano', // Incluye esta propiedad
    companionCustomMenuType: '', // Incluye esta propiedad
    hasChildren: false,
    childrenCount: 0,
    hasFoodAllergy: false,
    allergyDetails: '',
    specialMenuAdults: [],
    specialMenuChildren: [],
    childrenDetails: []
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
    const target = e.target as HTMLInputElement; // Aserción de tipo para HTMLInputElement
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : false; // Asignar false como valor predeterminado
  
    if (name === 'hasChildren') {
      setGuest(prev => ({
        ...prev,
        [name]: checked,
        childrenDetails: checked ? prev.childrenDetails : [],
        childrenCount: checked ? prev.childrenCount : 0
      }));
    } else if (name === 'menuType' || name === 'companionMenuType') {
      setGuest(prev => ({
        ...prev,
        [name]: value === 'estandar' ? 'estandar' : 'especial', // Cambia el valor de menuType
        ...(name === 'menuType' ? { specialMenuType: 'vegano', customMenuType: '' } : {}),
        ...(name === 'companionMenuType' ? { companionSpecialMenuType: 'vegano', companionCustomMenuType: '' } : {})
      }));
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setGuest(prev => ({ ...prev, [name]: newValue }));
    }
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


  const handleChangeMenuType = (isCompanion = false) => {
    setGuest(prev => {
      // Cambio para el acompañante
      if (isCompanion) {
        const newMenuType = prev.companionMenuType === 'estandar' ? 'especial' : 'estandar';
        return {
          ...prev,
          companionMenuType: newMenuType,
          // Si cambia a menú estándar, quita los detalles del menú especial
          companionSpecialMenuType: newMenuType === 'especial' ? prev.companionSpecialMenuType : 'vegano',
          companionCustomMenuType: newMenuType === 'especial' ? prev.companionCustomMenuType : '',
        };
      } 
      // Cambio para el invitado principal
      else {
        const newMenuType = prev.menuType === 'estandar' ? 'especial' : 'estandar';
        return {
          ...prev,
          menuType: newMenuType,
          // Si cambia a menú estándar, quita los detalles del menú especial
          specialMenuType: newMenuType === 'especial' ? prev.specialMenuType : 'vegano',
          customMenuType: newMenuType === 'especial' ? prev.customMenuType : '',
        };
      }
    });
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
       <div className="form-section">
        <div className="form-column">
          <label className="label">Nombre y Apellido</label>
          <input
            className="input"
            type="text"
            name="name"
            value={guest.name}
            onChange={handleChangeInput}
            placeholder="Nombre y Apellido"
          />
        </div>
        <div className="form-column">
          <label className="label">
          <input
  type="checkbox"
  checked={guest.menuType === 'especial'}
  onChange={(e) => handleChangeInput({
    ...e,
    target: {
      ...e.target,
      name: 'menuType',
      value: guest.menuType === 'estandar' ? 'especial' : 'estandar'
    }
  })}
/>
            Menú Especial
          </label>
          {guest.menuType === 'especial' && (
            <>
              <select
                className="input"
                name="specialMenuType"
                value={guest.specialMenuType}
                onChange={handleChangeInput}
              >
                <option value="vegano">Vegano</option>
                <option value="celiaco">Celíaco</option>
                <option value="otro">Otro</option>
              </select>
              {guest.specialMenuType === 'otro' && (
                <input
                  className="input"
                  type="text"
                  name="customMenuType"
                  value={guest.customMenuType}
                  onChange={handleChangeInput}
                  placeholder="Especificar tipo de menú"
                />
              )}
            </>
          )}
        </div>
      </div>

   {/* Aceptar Acompañante y Selección de Menú */}
<div className="form-section">
  <div className="form-column">
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
  <div className="form-column">
    {/* Checkbox y selección de menú para el Acompañante */}
    {guest.hasCompanion && (
      <>
        <label className="label">
          <input
            type="checkbox"
            checked={guest.companionMenuType === 'especial'}
            onChange={() => handleChangeMenuType(true)}
          />
          Menú Especial para Acompañante
        </label>
        {guest.companionMenuType === 'especial' && (
          <>
            <select
              className="input"
              name="companionSpecialMenuType"
              value={guest.companionSpecialMenuType}
              onChange={handleChangeInput}
            >
              <option value="vegano">Vegano</option>
              <option value="celiaco">Celíaco</option>
              <option value="otro">Otro</option>
            </select>
            {guest.companionSpecialMenuType === 'otro' && (
              <input
                className="input"
                type="text"
                name="companionCustomMenuType"
                value={guest.companionCustomMenuType}
                onChange={handleChangeInput}
                placeholder="Especificar tipo de menú"
              />
            )}
          </>
        )}
      </>
    )}
  </div>
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
  {/* Resumen para el Invitado Principal */}
  <p>
    Invitado Principal: {guest.name} - Menú: 
    {guest.menuType === 'especial' 
      ? `${guest.specialMenuType} ${guest.customMenuType ? `- ${guest.customMenuType}` : ''}` 
      : 'Estándar'}
  </p>

  {/* Resumen para el Acompañante, si está presente */}
  {guest.hasCompanion && (
    <p>
      Acompañante: {guest.companionName} - Menú: 
      {guest.companionMenuType === 'especial' 
        ? `${guest.companionSpecialMenuType} ${guest.companionCustomMenuType ? `- ${guest.companionCustomMenuType}` : ''}` 
        : 'Estándar'}
    </p>
  )}

  {/* Resumen para los Hijos */}
  {guest.childrenDetails.map((child, index) => (
    <p key={`child-menu-summary-${index}`}>
      Hijo {index + 1}: {child.name} - Menú: 
      {child.menuType === 'adulto' 
        ? 'Adulto' 
        : 'Infantil'}
    </p>
  ))}

  {/* Detalles adicionales, como alergias alimentarias, si es relevante */}
  {guest.hasFoodAllergy && (
    <p>
      Detalles de Alergia Alimentaria: {guest.allergyDetails}
    </p>
  )}
</div>

    {/* Botón de Enviar */}
    <button className="button" type="submit">Aceptar Invitación</button>
  </form>
);
}
