
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
  specialMenuType?: 'vegetariano' | 'gluten' | 'otro' | null;
  customMenuType?: string | null;
}

interface GuestFormState {
  name: string;
  menuType: 'estandar' | 'especial' | null;
  specialMenuType: 'vegetariano' | 'gluten' | 'otro' | null;
  customMenuType: string | null;
  hasCompanion: boolean;
  companionName: string;
  companionMenuType: 'estandar' | 'especial' | null;
  companionSpecialMenuType: 'vegetariano' | 'gluten' | 'otro' | null;
  companionCustomMenuType: string | null;
  hasChildren: boolean;
  childrenCount: number;
  childrenDetails: ChildWithMenuType[];
  hasFoodAllergy: boolean;
  allergyDetails: string;
  specialMenuAdults: SpecialMenuSelection[];
  specialMenuChildren: SpecialMenuSelection[];
  contactPhone: string;
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
  // Declaración de estados
  const [showForm, setShowForm] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [declinerName, setDeclinerName] = useState('');
  const [goodbyeMessage, setGoodbyeMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showSummary, setShowSummary] = useState(false);

  
  

  // useEffect para cargar datos del localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResponse = localStorage.getItem("weddingResponse");
      const storedGoodbyeMessage = localStorage.getItem("goodbyeMessage");

      if (storedResponse) {
        setResponse(storedResponse);
        setGoodbyeMessage(storedGoodbyeMessage || '');
      }

      const storedIsSubmitted = localStorage.getItem("formSubmitted") === "true";
      setIsSubmitted(storedIsSubmitted);
    }
  }, []);

  useEffect(() => {
    if (response) {
      localStorage.setItem("weddingResponse", response);
    }
  }, [response]);

  const handleBack = () => {
    setShowForm(false);
    setShowInput(false);
  };

  const handleAccept = () => {
    setResponse("accepted");
    setShowForm(true);
    setShowInput(false);
    setGoodbyeMessage('');
  };

  const handleDecline = () => {
    setResponse("declined");
    setShowForm(false);
    setShowInput(true);
    setGoodbyeMessage('');
  };

  const resetState = () => {
    setShowForm(false);
    setShowInput(false);
    setResponse(null); // Restablecer la decisión
    setDeclinerName(''); // Limpiar nombre del declinador
    setGoodbyeMessage(''); // Limpiar mensaje de despedida
    // Restablece cualquier otro estado que necesites aquí
};

const handleBackFromSummary = () => {
  setShowSummary(false); // Esto ocultaría el resumen y volvería al formulario
};

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const declineData = {
      nombre: declinerName,
      // Agrega más campos si es necesario
    };
  
    try {
      const response = await fetch('/api/invitados/no-asistentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(declineData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Crear un mensaje de despedida con HTML
      const goodbyeMsg = `Lamentamos que no puedas asistir a la boda, <strong>${declinerName}</strong>. Te enviamos un abrazo.`;
    setGoodbyeMessage(goodbyeMsg);
      localStorage.setItem("goodbyeMessage", goodbyeMsg);
      setShowInput(false);
      setResponse("declined");
      setIsSubmitted(true);
      localStorage.setItem("formSubmitted", "true");
    } catch (error) {
      console.error('Error al enviar los datos', error);
    }
  };

  if (response && isSubmitted) {
    return (
      <div className="page">
        <h1 className="heading">Formulario de Invitación a la Boda</h1>
        {response === "accepted" && (
           <p className="goodbyeMessage">¡Invitación Confirmada! ¡Gracias! Los esperamos el 1 de noviembre en la boda.</p>
        )}
        {response === "declined" && (
          <p className="goodbyeMessage" dangerouslySetInnerHTML={{ __html: goodbyeMessage }}></p>
        )}

        <style jsx>{`
          .goodbyeMessage {
            text-align: center;
            font-size: 20px; 
            color: black; 
            font-weight: normal;
          }
          .goodbyeMessage strong {
            font-weight: bold; 
            color: blue; 
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="heading">Formulario de Invitación a la Boda</h1>
  
      {/* Botón de "Volver" que solo se muestra si el usuario está en uno de los formularios */}
      {(!isSubmitted && (showForm || showInput || showSummary)) && (
  <button 
    onClick={() => {
      if(showSummary) {
        setShowSummary(false);
      } else {
        setShowForm(false);
        setShowInput(false);
        // Restablece aquí cualquier otro estado si es necesario
      }
    }} 
    className="back-button" 
    style={{ position: 'absolute', top: '20px', right: '20px' }}
  >
    Volver
  </button>
)}

{!showForm && !showInput && !response && (
  <div className="button-container">
    <button className="button" onClick={() => setShowForm(true)}>Ir a la Boda</button>
    <button className="button" onClick={() => setShowInput(true)}>No Puedo Ir a la Boda</button>
  </div>
)}
  
      {/* Mostrar el formulario de invitación a la boda */}
      {showForm && <WeddingInvitationForm />}
      
      {/* Mostrar el formulario de no asistencia */}
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
  
      {/* Mensaje de confirmación o despedida basado en la respuesta del usuario */}
      {response && isSubmitted && (
        <div>
          {response === "accepted" && (
            <p className="goodbyeMessage">¡Invitación Confirmada! ¡Gracias! Los esperamos el 1 de noviembre en la boda.</p>
          )}
          {response === "declined" && (
            <p className="goodbyeMessage" dangerouslySetInnerHTML={{ __html: goodbyeMessage }}></p>
          )}
        </div>
      )}
  
      <style jsx>{`
        .back-button {
          // Estilos para tu botón de "Volver"
          cursor: pointer;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 16px;
        }
        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }
        .button {
          // Estilos para los botones
          background-color: #DAA520;
          color: #000000;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          /* en negrita */
          font-weight: bold;
          font-size: 25px;
        }
        .button:hover {
          background-color: #000000;
          color: white;
        }
        .goodbyeMessage {
          text-align: center;
          font-size: 20px;
          color: black;
          font-weight: normal;
        }
        .goodbyeMessage strong {
          font-weight: bold; 
          color: blue; 
        }
      `}</style>
    </div>
  );
}


// Componente para el formulario de invitación a la boda.
function WeddingInvitationForm() {
  const [guest, setGuest] = useState<GuestFormState>({
    name: '',
    menuType: 'estandar',  // Estado inicial como 'estandar'
    specialMenuType: 'vegetariano', // Cambio aquí
    customMenuType: null,
    hasCompanion: false,
    companionName: '',
    companionMenuType: 'estandar',  // Estado inicial para el acompañante también como 'estandar'
    companionSpecialMenuType: 'vegetariano',
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
  const [errors, setErrors] = useState({
    companionNameError: '', childrenNameError: '', childrenMenuError: '', childSpecialMenuOtherError: '', specialMenuError: '', companionSpecialMenuError: '', transportError: ''
  }); // Estado de errores agregado


  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);



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
                specialMenuType: checked ? 'vegetariano' : null
            }));
            // Eliminar mensaje de error para el menú especial del invitado principal si se desmarca
            if (!checked) {
                setErrors(prevErrors => ({ ...prevErrors, specialMenuError: '' }));
            }
        } else if (name === 'companionMenuType') {
            setGuest(prev => ({
                ...prev,
                companionMenuType: checked ? 'especial' : 'estandar',
                companionSpecialMenuType: checked ? 'vegetariano' : null
            }));
            // Eliminar mensaje de error para el menú especial del acompañante si se desmarca
            if (!checked) {
                setErrors(prevErrors => ({ ...prevErrors, companionSpecialMenuError: '' }));
            }
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
        if (name === 'transportOption' && value.trim() !== '') {
            setErrors(prevErrors => ({ ...prevErrors, transportError: '' }));
        }
    }
};

const handleChangeChildrenDetails = (index: number, field: keyof ChildWithMenuType, value: string | boolean) => {
  setGuest(prevGuest => {
      const updatedChildren = [...prevGuest.childrenDetails];
      const updatedChild = { ...updatedChildren[index], [field]: value };
      updatedChildren[index] = updatedChild;

      return { ...prevGuest, childrenDetails: updatedChildren };
  });

  // Actualizar el estado de error para el menú especial "Otro"
  if (field === 'customMenuType') {
      const newError = typeof value === 'string' && value.trim() !== '' ? '' : 'Por favor, especifica el tipo de menú';
      setErrors(prevErrors => {
          const updatedErrors = { ...prevErrors };
          updatedErrors.childSpecialMenuOtherError = newError;
          return updatedErrors;
      });
  }

  // Eliminar mensaje de error si se proporciona un nombre válido para el hijo
  if (field === 'name' && typeof value === 'string' && value.trim() !== '') {
      setErrors(prevErrors => ({ ...prevErrors, childrenNameError: '' }));
  }

  // Eliminar mensaje de error del menú especial para cada hijo si se selecciona correctamente
  if (field === 'specialMenuType' && typeof value === 'string' && value.trim() !== '') {
      setErrors(prevErrors => ({ ...prevErrors, childrenMenuError: '' }));
  }
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
          companionSpecialMenuType: newMenuType === 'especial' ? prev.companionSpecialMenuType : 'vegetariano',
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
          specialMenuType: newMenuType === 'especial' ? prev.specialMenuType : 'vegetariano',
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



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error('Validación del formulario falló');
      return;
    }

    // En lugar de enviar el formulario directamente, muestra el resumen para revisión
    setShowSummary(true);

    // Añade un breve retraso antes de hacer scroll para asegurar que el botón ha sido renderizado
    setTimeout(() => {
      const buttonDestino = document.querySelector(".button-destino");
      if (buttonDestino) {
        const buttonPosition = buttonDestino.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerHeight / 1.5; // Ajuste para centrar en la pantalla
        const scrollToPosition = buttonPosition - offset;
  
        window.scrollTo({
          top: scrollToPosition,
          behavior: "smooth"
        });
      }
    }, 100); // El retraso garantiza que el botón destino ya esté renderizado y visible
  };


  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };




  const handleFinalSubmit = async () => {
    // Mapeo de childrenDetails a la estructura requerida
    const formattedChildrenDetails = guest.childrenDetails.map(child => ({
        name: child.name,
        menuType: child.menuType,
        isSpecialMenu: child.isSpecialMenu ? 1 : 0,
        specialMenuType: child.isSpecialMenu ? child.specialMenuType : null,
        customMenuType: child.isSpecialMenu && child.specialMenuType === 'otro' ? child.customMenuType : null
    }));
  
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
  
        // Aquí se maneja el envío exitoso del formulario
        localStorage.setItem("weddingResponse", "accepted");
        localStorage.setItem("formSubmitted", "true");
        setIsSubmitted(true); // Actualizar el estado para reflejar que se ha enviado
      
        setShowSummary(false); // Asegurarse de ocultar el resumen si estaba siendo mostrado
        console.log('Formulario enviado con éxito');
         // Refrescar la página después del envío exitoso
      window.location.reload();
    } catch (error) {
        console.error('Error al enviar el formulario', error);
    }
  };

  useEffect(() => {
    const submitted = localStorage.getItem("formSubmitted") === "true";
    setIsSubmitted(submitted);
  }, []);

// Renderización condicional en el componente
if (isSubmitted) {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <h1>¡Invitación Confirmada!</h1>
      <p className="goodbyeMessage">
        ¡Mil gracias, {guest.name}{guest.hasCompanion ? ` y ${guest.companionName}` : ''}{guest.childrenDetails.length > 0 ? ` junto a vuestros peques` : ''}! Estamos deseando veros el 1 de noviembre en nuestra boda. ¡Va a ser un día inolvidable!
      </p>
    </div>
  );
}


 
  return (
    <div>
      {!showSummary ? (
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
                    <option value="vegetariano">Vegetariano</option>
                    <option value="gluten">Sin gluten</option>
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
                        <option value="vegetariano">Vegetariano</option>
                        <option value="gluten">Sin gluten</option>
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
                      <span className="label-text label-tipo-menu">Tipo de Menú</span>
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
                        <label className="label label-tipo-menu-especial">Tipo de Menú Especial</label>
                        <select
                          className="input"
                          value={child.specialMenuType || ''}
                          onChange={(e) => handleChangeChildrenDetails(index, 'specialMenuType', e.target.value)}
                        >
                          <option value="">Seleccionar Tipo</option>
                          <option value="vegetariano">Vegetariano</option>
                          <option value="gluten">Sin gluten</option>
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
    <h2 className='resumen'>Resumen de Menús Seleccionados</h2>
    
    {/* Resumen para el Invitado Principal */}
    <p>
      Invitado Principal: {guest.name} - Menú:
      {guest.menuType === 'especial'
        ? `${guest.specialMenuType} ${guest.customMenuType ? `- ${guest.customMenuType}` : ''}`
        : 'Estándar'}
      {errors.specialMenuError && (
        <span className="error-message" style={{ color: 'red' }}> - {errors.specialMenuError}</span>
      )}
    </p>

    {/* Resumen para el Acompañante, si está presente */}
    {guest.hasCompanion && (
      <p>
        Acompañante: {guest.companionName} - Menú:
        {guest.companionMenuType === 'especial'
          ? `${guest.companionSpecialMenuType} ${guest.companionCustomMenuType ? `- ${guest.companionCustomMenuType}` : ''}`
          : 'Estándar'}
        {errors.companionSpecialMenuError && (
          <span className="error-message" style={{ color: 'red' }}> - {errors.companionSpecialMenuError}</span>
        )}
      </p>
    )}

    {/* Resumen para los Hijos */}
    {guest.childrenDetails.map((child, index) => (
      <p key={`child-menu-summary-${index}`}>
        Hijo {index + 1}: {child.name} - Tipo de Menú: {child.menuType}
        {child.isSpecialMenu && ` - Menú Especial: ${child.specialMenuType}`}
        {child.specialMenuType === 'otro' && child.customMenuType && ` - Detalles: ${child.customMenuType}`}
        {errors.childrenMenuError && (
          <span className="error-message" style={{ color: 'red' }}> - {errors.childrenMenuError}</span>
        )}
      </p>
    ))}

    {/* Resumen de número de teléfono */}
    <p>
      Teléfono de Contacto: {guest.contactPhone}
    </p>

    {/* Resumen de la opción de transporte */}
    <p>
      Opción de Transporte: {guest.transportOption}
      {errors.transportError && (
        <span className="error-message" style={{ color: 'red' }}> - {errors.transportError}</span>
      )}
    </p>


          </div>

          {/* Botón de Enviar para revisar */}
          <button className="button" type="submit">Revisar Invitación</button>
        </form>
      ) : (
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

          {/* Botones para confirmar o cancelar el envío */}
          <button className="button button-confirm button-destino" onClick={handleFinalSubmit}>Confirmar y Enviar</button>
          <button className="button" onClick={() => setShowSummary(false)}>Cancelar y Editar</button>
        </div>
      )}
    </div>
  );
}