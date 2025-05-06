export interface IFormGasto {
  titulo: string;
  importe: number;
  pagadoPor: string;
  fecha: string;
}

export interface member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface group {
  id: string;
  name: string;
  memberships: member[];
}