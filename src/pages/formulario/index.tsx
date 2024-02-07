
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
  specialMenuType?: 'vegetariano' | 'celiaco' | 'otro' | null;
  customMenuType?: string | null;
}

interface GuestFormState {
  name: string;
  menuType: 'estandar' | 'especial' | null;
  specialMenuType: 'vegano' | 'celiaco' | 'otro' | null;
  customMenuType: string | null;
  hasCompanion: boolean;
  companionName: string;
  companionMenuType: 'estandar' | 'especial' | null;
  companionSpecialMenuType: 'vegano' | 'celiaco' | 'otro' | null;
  companionCustomMenuType: string | null;
  hasChildren: boolean;
  childrenCount: number;
  childrenDetails: ChildWithMenuType[];
  hasFoodAllergy: boolean;
  allergyDetails: string;
  specialMenuAdults: SpecialMenuSelection[];
  specialMenuChildren: SpecialMenuSelection[];
  contactPhone: string;
  
}
interface GuestFormState {
  // ... otras propiedades ...
  transportOption: 'bus' | 'car' | null;
}

interface FormErrors {
  companionNameError: string;
  childrenNameError: string;
  childrenMenuError: string; 
  childSpecialMenuOtherError: string;
  specialMenuError: string;
  companionSpecialMenuError: string;
  transportError: string;
  
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
    menuType: 'estandar',  // Estado inicial como 'estandar'
    specialMenuType: 'vegano', // Cambio aquí
    customMenuType: null,
    hasCompanion: false,
    companionName: '',
    companionMenuType: 'estandar',  // Estado inicial para el acompañante también como 'estandar'
    companionSpecialMenuType: 'vegano',
    companionCustomMenuType: null,
    hasChildren: false,
    childrenCount: 0,
    childrenDetails: [],
    hasFoodAllergy: false,
    allergyDetails: '',
    specialMenuAdults: [],
    specialMenuChildren: [],
    contactPhone: '',
    transportOption: null,
  });

  const [specialAdultMenuCount, setSpecialAdultMenuCount] = useState(0);
  const [specialChildMenuCount, setSpecialChildMenuCount] = useState(0);
  const [errors, setErrors] = useState({ companionNameError: '', childrenNameError: '', childrenMenuError: '',  childSpecialMenuOtherError: '', specialMenuError: '',  companionSpecialMenuError: '',  transportError: ''
  }); // Estado de errores agregado



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
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
  
      if (name === 'menuType') {
        setGuest(prev => ({
          ...prev,
          menuType: checked ? 'especial' : 'estandar',
          specialMenuType: checked ? 'vegano' : null
        }));
      } else if (name === 'companionMenuType') {
        setGuest(prev => ({
          ...prev,
          companionMenuType: checked ? 'especial' : 'estandar',
          companionSpecialMenuType: checked ? 'vegano' : null
        }));
      } else {
        setGuest(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setGuest(prev => ({
        ...prev,
        [name]: value
      }));
  
      // Limpia el mensaje de error cuando se empieza a escribir en los campos de menú especial "otros"
      if (name === 'customMenuType' && value.trim() !== '') {
        setErrors(prevErrors => ({ ...prevErrors, specialMenuError: '' }));
      }
      if (name === 'companionCustomMenuType' && value.trim() !== '') {
        setErrors(prevErrors => ({ ...prevErrors, companionSpecialMenuError: '' }));
      }
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

  const handleChangeChildrenDetails = (index: number, field: keyof ChildWithMenuType, value: string | boolean) => {
    setGuest(prevGuest => {
      const updatedChildren = [...prevGuest.childrenDetails];
      const updatedChild = { ...updatedChildren[index], [field]: value };
      updatedChildren[index] = updatedChild;

      // Actualizar el estado de error para el menú especial "Otro"
      if (field === 'customMenuType') {
        const newError = typeof value === 'string' && value.trim() !== '' ? '' : 'Por favor, especifica el tipo de menú';
        setErrors(prevErrors => ({ ...prevErrors, childSpecialMenuOtherError: newError }));
      }

      return { ...prevGuest, childrenDetails: updatedChildren };
    });
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
    let isValid = true;
    let newErrors: FormErrors = {
      companionNameError: '',
      childrenNameError: '',
      childrenMenuError: '',
      childSpecialMenuOtherError: '',
      specialMenuError: '', // Error para menú especial del invitado principal
      companionSpecialMenuError: '', // Error para menú especial del acompaña
      transportError: '', // Error para opciones de transporte
        };
  
    // Verificar si el nombre del invitado principal está vacío
    if (!guest.name || guest.name.trim() === '') {
      newErrors.companionNameError = 'El nombre es un campo requerido';
      isValid = false;
    }
  
    // Verificar si el teléfono de contacto está vacío
    if (!guest.contactPhone || guest.contactPhone.trim() === '') {
      console.error('El teléfono de contacto es un campo requerido');
      isValid = false;
    }
  
    // Si se ha elegido tener acompañante, verificar si su nombre está proporcionado
    if (guest.hasCompanion) {
      if (!guest.companionName || guest.companionName.trim() === '') {
        newErrors.companionNameError = 'Por favor, introduce el nombre del acompañante';
        isValid = false;
      }
    }
  
    // Si hay niños, verificar cada uno de ellos
    if (guest.hasChildren && guest.childrenDetails.length > 0) {
      guest.childrenDetails.forEach((child, index) => {
        if (!child.name || child.name.trim() === '') {
          newErrors.childrenNameError = `El nombre del hijo ${index + 1} es requerido`;
          isValid = false;
        }
  
        // Verificar el menú especial para cada hijo que lo requiera
        if (child.isSpecialMenu) {
          if (!child.specialMenuType || child.specialMenuType.trim() === '') {
            newErrors.childrenMenuError = `Por favor, selecciona el tipo de menú especial para el hijo ${index + 1}`;
            isValid = false;
          } else if (child.specialMenuType === 'otro' && (!child.customMenuType || child.customMenuType.trim() === '')) {
            newErrors.childSpecialMenuOtherError = `Por favor, especifica el tipo de menú para el hijo ${index + 1}`;
            isValid = false;
          }
        }
      });
    }
  
    // Validación para el menú especial del invitado principal
    if (guest.menuType === 'especial') {
      const error = guest.specialMenuType === 'otro' && (!guest.customMenuType || guest.customMenuType.trim() === '')
        ? 'Debe especificar el tipo de menú especial para el invitado principal.'
        : '';
      newErrors.specialMenuError = error;
      if (error) isValid = false;
    }
  
    // Validación para el menú especial del acompañante
    if (guest.hasCompanion && guest.companionMenuType === 'especial') {
      const companionError = guest.companionSpecialMenuType === 'otro' && (!guest.companionCustomMenuType || guest.companionCustomMenuType.trim() === '')
        ? 'Debe especificar el tipo de menú especial para el acompañante.'
        : '';
      newErrors.companionSpecialMenuError = companionError;
      if (companionError) isValid = false;
    }


    // Validación para la opción de transporte
  if (!guest.transportOption) {
    newErrors.transportError = 'Por favor, selecciona una opción de transporte';
    isValid = false;
  }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificación de la validez del formulario
    if (!validateForm()) {
        console.error('Validación del formulario falló');
        return;
    }

    // Mapeo de childrenDetails a la estructura requerida
    const formattedChildrenDetails = guest.childrenDetails.map(child => ({
        name: child.name,
        menuType: child.menuType,
        isSpecialMenu: child.isSpecialMenu ? 1 : 0,
        specialMenuType: child.isSpecialMenu ? child.specialMenuType : null,
        customMenuType: child.isSpecialMenu && child.specialMenuType === 'otro' ? child.customMenuType : null
    }));

    // Preparación de los datos del formulario
    const formData = {
        name: guest.name,
        menuType: guest.menuType || 'estandar',
        specialMenuType: guest.menuType === 'especial' && guest.specialMenuType !== 'otro' ? guest.specialMenuType : null,
        customMenuType: guest.menuType === 'especial' && guest.specialMenuType === 'otro' ? guest.customMenuType : null,
        hasCompanion: guest.hasCompanion,
        companionName: guest.hasCompanion ? guest.companionName : null,
        companionMenuType: guest.hasCompanion ? guest.companionMenuType || 'estandar' : null,
        companionSpecialMenuType: guest.hasCompanion && guest.companionMenuType === 'especial' && guest.companionSpecialMenuType !== 'otro' ? guest.companionSpecialMenuType : null,
        companionCustomMenuType: guest.hasCompanion && guest.companionMenuType === 'especial' && guest.companionSpecialMenuType === 'otro' ? guest.companionCustomMenuType : null,
        hasChildren: guest.hasChildren,
        childrenCount: guest.hasChildren ? guest.childrenCount : null,
        childrenDetails: formattedChildrenDetails,
        hasFoodAllergy: guest.hasFoodAllergy || false,
        allergyDetails: guest.hasFoodAllergy ? guest.allergyDetails : null,
        contactPhone: guest.contactPhone,
        transportOption: guest.transportOption
    };

    console.log('Datos del formulario a enviar:', formData);

    try {
        const response = await fetch('/api/formularios/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Formulario enviado con éxito');
        // Aquí puedes agregar cualquier lógica adicional para manejar la respuesta exitosa.
    } catch (error) {
        console.error('Error al enviar el formulario', error);
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
              value={guest.specialMenuType ?? ''}
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
                value={guest.customMenuType ?? ''}
                onChange={handleChangeInput}
                placeholder="Especificar tipo de menú"
              />
            )}
            {/* Mensaje de error para menú especial del invitado principal */}
            {errors.specialMenuError && (
              <div className="error-message" style={{ color: 'red' }}>{errors.specialMenuError}</div>
            )}
          </>
        )}
      </div>
    </div>
      <div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '0rem', }}>
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
      Acompañante
    </label>
    {guest.hasCompanion && (
      <>
        <input
          className="input"
          type="text"
          name="companionName"
          value={guest.companionName}
          onChange={handleChangeInput}
          placeholder="Nombre y Apellido del Acompañante"
        />
        {/* Mensaje de error si el nombre del acompañante no está presente */}
        {errors.companionNameError && (
          <div className="error-message" style={{ color: 'red' }}>{errors.companionNameError}</div>
        )}
      </>
    )}
  </div>
  <div className="form-column">
    {guest.hasCompanion && (
      <>
        <label className="label">
          <input
            type="checkbox"
            checked={guest.companionMenuType === 'especial'}
            onChange={(e) => handleChangeInput({
              ...e,
              target: {
                ...e.target,
                name: 'companionMenuType',
                value: guest.companionMenuType === 'estandar' ? 'especial' : 'estandar'
              }
            })}
          />
          Menú Especial para Acompañante
        </label>
        {guest.companionMenuType === 'especial' && (
          <>
            <select
              className="input"
              name="companionSpecialMenuType"
              value={guest.companionSpecialMenuType ?? ''}
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
                value={guest.companionCustomMenuType ?? ''}
                onChange={handleChangeInput}
                placeholder="Especificar tipo de menú"
              />
            )}
            {/* Mensaje de error para menú especial del acompañante */}
            {errors.companionSpecialMenuError && (
              <div className="error-message" style={{ color: 'red' }}>{errors.companionSpecialMenuError}</div>
            )}
          </>
        )}
      </>
    )}
  </div>
</div>

      <div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem', }}>
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
          {/* Mostrar mensaje de error si el nombre de este hijo específico está vacío */}
          {!child.name && errors.childrenNameError && (
            <div className="error-message" style={{ color: 'red' }}>{errors.childrenNameError}</div>
          )}
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
              {/* Mostrar mensaje de error si el menú especial no está seleccionado correctamente */}
              {!child.specialMenuType && errors.childrenMenuError && (
                <div className="error-message" style={{ color: 'red' }}>{errors.childrenMenuError}</div>
              )}
              {child.specialMenuType === 'otro' && (
                <input
                  className="input"
                  type="text"
                  value={child.customMenuType || ''}
                  onChange={(e) => handleChangeChildrenDetails(index, 'customMenuType', e.target.value)}
                  placeholder="Especificar tipo de menú"
                />
              )}
              {/* Mostrar mensaje de error si no se especifica el menú "Otro" */}
              {errors.childSpecialMenuOtherError && (
                <div className="error-message" style={{ color: 'red' }}>{errors.childSpecialMenuOtherError}</div>
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

      <div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem', }}>
        {/* Contenido de la sección */}
      </div>


      {/* Opciones de Transporte */}
      <div className="form-section transport-section">
  <div className="form-column">
    <h3>Opciones de Transporte a la Boda</h3>
    <p>Por favor, indica cómo prefieres llegar a la boda:</p>
    <div className="transport-option">
      <input
        type="radio"
        name="transportOption"
        value="bus"
        checked={guest.transportOption === 'bus'}
        onChange={handleChangeInput}
      />
      <label>Utilizaré el autobús proporcionado por los novios (Pasará por Barcelona y Cerdanyola del Vallès).</label>
    </div>
    <div className="transport-option">
      <input
        type="radio"
        name="transportOption"
        value="car"
        checked={guest.transportOption === 'car'}
        onChange={handleChangeInput}
      />
      <label>Prefiero viajar en mi propio coche.</label>
    </div>
    {/* Mensaje de error si no se selecciona una opción de transporte */}
    {errors.transportError && (
      <div className="error-message" style={{ color: 'red' }}>{errors.transportError}</div>
    )}
  </div>
</div>

<div style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem' }}>
  {/* Separador de sección */}
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

{/* muestra si utizas Utilizaré el autobús proporcionado por los novios (Pasará por Barcelona y Cerdanyola del Vallès).

Prefiero viajar en mi propio coche. */}
        <p>
          Opción de Transporte: {guest.transportOption}
        </p>
       
  
      </div>

      {/* Botón de Enviar */}
      <button className="button" type="submit">Aceptar Invitación</button>
    </form>
  );
}