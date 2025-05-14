export interface IFormEvent {
  name: string;
  participants: string[];
  emoji?: string; // Campo opcional para el emoji
}

export interface UserSuggestion {
  id: string;
  name: string;
  email: string;
}

export interface Iuser {
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}