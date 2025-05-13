export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_picture_url: string | null;
  is_premium: boolean;
  role: string;
  active: boolean;
  created_at: string;
  total_groups_created: number;
}

