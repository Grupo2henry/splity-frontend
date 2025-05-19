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

export interface expense {
  id: string;
  description: string;
  amount: number;
  paid_by: {
    id: string;
    name: string};
  date: string;
  imgUrl: string;
  created_at: string;
}

export interface group {
  id: string;
  name: string;
  memberships: member[];
  expenses: expense[];
  created_by: member;
  owner: member;
}