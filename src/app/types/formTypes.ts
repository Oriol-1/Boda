export interface SpecialMenuSelection {
    type: string;
    customType?: string;
  }
  
  export interface ChildWithMenuType {
    name: string;
    menuType: 'infantil' | 'adulto';
    isSpecialMenu: boolean;
    specialMenuType?: 'vegetariano' | 'celiaco' | 'otro';
    customMenuType?: string;
  }
  
  export interface GuestFormState {
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
  