export type CommunityRole = {
  id: number;
  name: string;
  hierarchyLevel: number;
  canManageChannels: boolean;
  canBanUsers: boolean;
  canManageRoles: boolean;
  canDeleteMessages: boolean;
  canManageCommunitySettings: boolean;
};
