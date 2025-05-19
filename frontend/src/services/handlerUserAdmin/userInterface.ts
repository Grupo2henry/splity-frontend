export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  quantity: number;
  active: boolean;
  profile_picture_url: string | null;
  is_premium: boolean;
}
