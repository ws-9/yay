import type { CommunityRole } from './CommunityRole';

export type Member = {
  userId: number;
  username: string;
  communityId: number;
  communityName: string;
  role: CommunityRole;
};
