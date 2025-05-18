export interface CreatedBy {
  id: string;
  name: string;
}

export interface GroupDetails {
  id: number;
  name: string;
  active: boolean;
  emoji: string | null;
  created_at: Date;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  created_by: CreatedBy;
}

export interface ActualGroupMembership {
  id: number;
  active: boolean;
  joined_at: Date;
  status: string;
  role: string;
  group: GroupDetails;
}

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

  actualGroupMembership: ActualGroupMembership | null; // Modificado para el nuevo state
  setActualGroupMembership: (membership: ActualGroupMembership | null) => void;
  actualGroupMembershipErrors: string[];
  loadingActualGroupUserMembership: boolean;
  getActualGroupUserMembership: (groupId: string) => Promise<void>

  updateGroup: (groupId: string, groupData: any) => Promise<void>;
  updatingGroup: boolean;
  updateGroupErrors: string[];

}