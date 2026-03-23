import type { Channel } from './Channel';
import type { CommunityRole } from './CommunityRole';

export type Community = {
  id: number;
  name: string;
  ownerId: number;
  ownerUsername: string;
  role: CommunityRole | undefined;
  channels: Array<Channel> | undefined;
};
