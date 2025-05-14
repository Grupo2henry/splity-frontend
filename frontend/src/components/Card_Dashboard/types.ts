export interface IGroup {
  id: number; // El ID del grupo es un número según tu ejemplo
  name: string;
  active: boolean;
  created_by: {
    id: string;
    name: string;
    email: string;
    created_at: string; // O Date si quieres parsearlo
    active: boolean;
  };
  created_at: string; // O Date si quieres parsearlo
  cantidad?: number; // Agregamos 'cantidad' como opcional si a veces está presente
  emoji?: string;
  // Puedes agregar otras propiedades que vengan en la respuesta de tu API
}