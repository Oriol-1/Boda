"use client"
import React, { useEffect, useState } from 'react';
import './styles.css';

// Definiciones de interfaces para tipar los datos del formulario.
interface SpecialMenuSelection {
  type: string;
  customType?: string;
}

interface ChildWithMenuType {
  name: string;
  menuType: 'infantil' | 'adulto';
  isSpecialMenu: boolean;
  specialMenuType?: 'vegetariano' | 'celiaco' | 'otro';
  customMenuType?: string; // Para almacenar el texto del menú personalizado
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
  contactPhone: string;
}

// Componente principal del formulario de invitación a la boda.

export default function FormularioPage() {
  const [showForm, setShowForm] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [declinerName, setDeclinerName] = useState('');
  const [goodbyeMessage, setGoodbyeMessage] = useState('');

  // Función para manejar la aceptación de la invitación.
  const handleAccept = () => {
    setShowForm(true);
    setShowInput(false);
    setGoodbyeMessage('');
  };


  // Función para manejar el rechazo de la invitación.
  const handleDecline = () => {
    setShowForm(false);
    setShowInput(true);
    setGoodbyeMessage('');
  };

    // Función para manejar el envío del formulario de rechazo.
  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoodbyeMessage(`Lamentamos que no puedas asistir a la boda, <span class="boldText">${declinerName}</span>. Te enviamos un abrazo.`);
    setShowInput(false);
  };

    // Renderización condicional basada en el estado del formulario y mensajes.
  return (
    <div className="page">
      <h1 className="heading">Formulario de Invitación a la Boda</h1>
      {!showForm && !showInput && !goodbyeMessage && (
        <div className="button-container">
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

// Componente para el formulario de invitación a la boda.
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
    childrenDetails: [],
    contactPhone: ''
  });

  const [specialAdultMenuCount, setSpecialAdultMenuCount] = useState(0);
  const [specialChildMenuCount, setSpecialChildMenuCount] = useState(0);

  useEffect(() => {
    let adultSpecialMenuCount = 0;
    let childSpecialMenuCount = 0;
  
    // Contar menús especiales para adultos
    if (guest.menuType === 'especial') {
      adultSpecialMenuCount += 1;
    }
    if (guest.hasCompanion && guest.companionMenuType === 'especial') {
      adultSpecialMenuCount += 1;
    }
  
    // Contar menús especiales para niños
    guest.childrenDetails.forEach(child => {
      if (child.isSpecialMenu) {
        childSpecialMenuCount += 1;
      }
    });
  
    setSpecialAdultMenuCount(adultSpecialMenuCount);
    setSpecialChildMenuCount(childSpecialMenuCount);
  }, [guest]);


  const [childMenuCounts, setChildMenuCounts] = useState<number[]>([0]);

  const handleAddChildMenu = () => {
    setChildMenuCounts([...childMenuCounts, 0]);
  };
  
  const handleRemoveChildMenu = (index: number) => {
    setGuest(prev => {
      const updatedChildrenDetails = prev.childrenDetails.filter((_, i) => i !== index);
  
      return {
        ...prev,
        childrenDetails: updatedChildrenDetails,
        hasChildren: updatedChildrenDetails.length > 0,
        childrenCount: updatedChildrenDetails.length
      };
    });
  };


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
      childrenDetails: [...prev.childrenDetails, { name: '', menuType: 'infantil', isSpecialMenu: false }],
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
    setChildMenuCounts(Array.from(Array(newCount).keys()));
    setGuest(prev => ({
      ...prev,
      childrenCount: newCount,
      childrenDetails: prev.childrenDetails.slice(0, newCount),
    }));
  };

  const validateForm = () => {
    // Aquí puedes añadir todas las validaciones necesarias
    if (guest.name === '' || guest.contactPhone === '') {
      console.error('Nombre y teléfono son campos requeridos');
      return false;
    }
    // Agrega más validaciones según sea necesario
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/formularios/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guest),
      });
  
      if (response.ok) {
        // Aquí puedes manejar una respuesta exitosa, como mostrar un mensaje de confirmación
        console.log('Formulario enviado con éxito');
      } else {
        // Aquí puedes manejar respuestas de error, como mostrar un mensaje de error
        console.error('Error al enviar el formulario');
      }
    } catch (error) {
      // Aquí puedes manejar excepciones de red o errores inesperados
      console.error('Error al procesar el formulario', error);
    }
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
            required 
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
<div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '0rem',}}>
  {/* Contenido de la sección */}
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
<div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem',}}>
  {/* Contenido de la sección */}
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
      {guest.childrenDetails.map((child, index) => (
        <div key={index} className="child-detail">
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
          <label className="label">
            <input
              type="checkbox"
              checked={child.isSpecialMenu}
              onChange={(e) => handleChangeChildrenDetails(index, 'isSpecialMenu', e.target.checked)}
            />
            Menú Especial
          </label>
          {child.isSpecialMenu && (
            <>
              <label className="label">Tipo de Menú Especial</label>
              <select
                className="input"
                value={child.specialMenuType || ''}
                onChange={(e) => handleChangeChildrenDetails(index, 'specialMenuType', e.target.value)}
              >
                <option value="">Seleccionar Tipo</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="celiaco">Celíaco</option>
                <option value="otro">Otro</option>
              </select>
              {child.specialMenuType === 'otro' && (
                <input
                  className="input"
                  type="text"
                  value={child.customMenuType || ''}
                  onChange={(e) => handleChangeChildrenDetails(index, 'customMenuType', e.target.value)}
                  placeholder="Especificar tipo de menú"
                />
              )}
            </>
          )}
          <button type="button" onClick={() => handleRemoveChildMenu(index)} className="remove-button">
            Eliminar
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddChild} className="add-button">
        Agregar Hijo
      </button>
    </>
  )}
</div>

<div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem',}}>
  {/* Contenido de la sección */}
</div>

{/* Teléfono de Contacto */}
<div className="form-section">
<label className="label label-phone">Teléfono de Contacto</label>
  <input
   className="input"
   type="tel"
   name="contactPhone"
   value={guest.contactPhone}
   required 
    onChange={e => {
      // Asegurarse de que solo se introduzcan números
      const value = e.target.value;
      const re = /^[0-9\b]+$/; // Permite números y teclas de retroceso
      if (value === '' || re.test(value)) {
        handleChangeInput(e);
      }
    }}
    placeholder="Número de Teléfono"
  />
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
    Hijo {index + 1}: {child.name} - Tipo de Menú: {child.menuType}
    {child.isSpecialMenu && ` - Menú Especial: ${child.specialMenuType}`}
    {child.specialMenuType === 'otro' && child.customMenuType && ` - Detalles: ${child.customMenuType}`}
  </p>
))}

{/* resumen de numero de telefono */}
<p>
  Teléfono de Contacto: {guest.contactPhone}
</p>


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
