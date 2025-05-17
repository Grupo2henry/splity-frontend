/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Group {
  id: number;
  name: string;
  active: boolean;
  created_by: {
    id: string;
    name: string;
    email: string;
    created_at: string;
    active: boolean;
  };
  created_at: string;
  cantidad?: number;
  emoji?: string;
  locationName?: string;
  logitude?: string;
  latitude?: string;
  // Puedes agregar otras propiedades que vengan en la respuesta de tu API
}

export interface GroupContextType {
  memberGroups: Group[];
  setMemberGroups: (groups: Group[]) => void;
  adminGroups: Group[];
  setAdminGroups: (groups: Group[]) => void;
  groupErrors: string[];
  createGroup: (groupData: any) => Promise<void>;
  fetchMemberGroups: () => Promise<void>;
  fetchAdminGroups: () => Promise<void>;
  loadingGroups: boolean;
  setLoadingGroups: (loading: boolean) => void;
}