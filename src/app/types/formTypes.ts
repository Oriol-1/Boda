// Define una interfaz para la selección de menús especiales.
// Utilizada para representar la elección de un tipo de menú especial y una opción personalizada si es necesario.
export interface SpecialMenuSelection {
  type: string; // Tipo de menú especial (ej. vegetariano, vegano, etc.).
  customType?: string; // Tipo de menú especial personalizado, si se selecciona 'otro'.
}

// Define una interfaz para representar los detalles de un niño asociado a un invitado.
// Incluye el nombre del niño, el tipo de menú, y opciones de menú especial si es necesario.
export interface ChildWithMenuType {
  name: string; // Nombre del niño.
  menuType: 'infantil' | 'adulto'; // Tipo de menú para el niño (infantil o adulto).
  isSpecialMenu: boolean; // Indica si el niño requiere un menú especial.
  specialMenuType?: 'vegetariano' | 'celiaco' | 'otro'; // Tipo de menú especial para el niño.
  customMenuType?: string; // Tipo de menú especial personalizado para el niño, si se selecciona 'otro'.
}

// Define una interfaz para el estado del formulario del invitado.
// Incluye detalles sobre el invitado, su menú, acompañante, hijos, alergias alimentarias, y opciones de menús especiales.
export interface GuestFormState {
  name: string; // Nombre del invitado.
  menuType: 'estandar' | 'especial'; // Tipo de menú del invitado (estándar o especial).
  specialMenuType: 'vegano' | 'celiaco' | 'otro'; // Tipo de menú especial del invitado.
  customMenuType: string; // Tipo de menú especial personalizado del invitado, si se selecciona 'otro'.
  hasCompanion: boolean; // Indica si el invitado tiene acompañante.
  companionName: string; // Nombre del acompañante.
  companionMenuType: 'estandar' | 'especial'; // Tipo de menú del acompañante (estándar o especial).
  companionSpecialMenuType: 'vegano' | 'celiaco' | 'otro'; // Tipo de menú especial del acompañante.
  companionCustomMenuType: string; // Tipo de menú especial personalizado del acompañante, si se selecciona 'otro'.
  hasChildren: boolean; // Indica si el invitado tiene hijos.
  childrenCount: number; // Número de hijos del invitado.
  childrenDetails: ChildWithMenuType[]; // Detalles de los hijos del invitado.
  hasFoodAllergy: boolean; // Indica si el invitado tiene alergias alimentarias.
  allergyDetails: string; // Detalles de las alergias alimentarias del invitado.
  specialMenuAdults: SpecialMenuSelection[]; // Selecciones de menú especial para adultos.
  specialMenuChildren: SpecialMenuSelection[]; // Selecciones de menú especial para niños.
  contactPhone: string; // Número de teléfono de contacto del invitado.
}
