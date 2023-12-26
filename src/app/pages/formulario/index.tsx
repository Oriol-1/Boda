"use client"
import React, { useState } from 'react';
import './styles.css';

export const config = { runtime: 'client' };

interface GuestFormState {
  name: string;
  hasCompanion: boolean;
  companionName: string;
  hasChildren: boolean;
  childrenCount: number;
  hasFoodAllergy: boolean;
  allergyDetails: string;
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
    allergyDetails: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGuest({
      ...guest,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envío aquí
    console.log(guest);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Nombre y Apellido */}
        <label className="label">Nombre y Apellido</label>

      <input className="input" type="text" name="name" value={guest.name} onChange={handleChange} placeholder="Nombre y Apellido" />

      {/* Aceptar Acompañante */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasCompanion" checked={guest.hasCompanion} onChange={handleChange} />
          <span className="label-text">Acompañante</span>
        </label>
        {guest.hasCompanion && (
          <input className="input" type="text" name="companionName" value={guest.companionName} onChange={handleChange} placeholder="Nombre y Apellido del Acompañante" />
        )}
      </div>

      {/* Ir con Hijos */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasChildren" checked={guest.hasChildren} onChange={handleChange} />
            <span className="label-text">Ir con Niños</span>
       
        </label>
        {guest.hasChildren && (
          <input className="input" type="number" name="childrenCount" value={guest.childrenCount} onChange={handleChange} placeholder="Cantidad de Niños" />
        )}
      </div>

      {/* Alergias Alimentarias */}
      <div className="checkbox-section">
        <label className="label">
          <input type="checkbox" name="hasFoodAllergy" checked={guest.hasFoodAllergy} onChange={handleChange} />
            <span className="label-text">Alergias Alimentarias</span>
      
        </label>
        {guest.hasFoodAllergy && (
          <input className="input" type="text" name="allergyDetails" value={guest.allergyDetails} onChange={handleChange} placeholder="Detalles de la Alergia Alimentaria" />
        )}
      </div>

      {/* Botón de Enviar */}
      <button className="button" type="submit">Aceptar Invitación</button>
    </form>
  );
}


