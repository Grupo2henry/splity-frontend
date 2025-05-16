export interface UserInMembership {
  id: string;
  name: string;
  email: string;
  // Agregá más campos si tu modelo de usuario los tiene
}

export interface Membership {
  user: UserInMembership;
  role: string;
  // Otros campos si los necesitás
}


export interface GroupInUserMembership {
  id: number;
  name: string;
  active: boolean;
  emoji: string | null;
}

export interface UserMembership {
  id: number;
  active: boolean;
  joined_at: string;
  status: string;
  role: string;
  group: GroupInUserMembership;
}

export interface MembershipContextType {
  participants: Membership[];
  participantsErrors: string[];
  loadingParticipants: boolean;
  getParticipantsByGroupId: (groupId: string) => Promise<void>;

  userMemberships: UserMembership[];
  userMembershipsErrors: string[];
  loadingUserMemberships: boolean;
  fetchUserMemberships: () => Promise<void>;

  actualGroupRole: string | null;
}

