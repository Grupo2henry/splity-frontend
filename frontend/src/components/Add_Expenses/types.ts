export interface IFormGasto {
  description: string;
  amount: number;
  paid_by: string;
  date: string;
  imgUrl: string;
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