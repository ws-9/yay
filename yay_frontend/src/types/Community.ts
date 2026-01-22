import type { Channel } from './Channel';

export type Community = {
  id: number;
  name: string;
  ownerId: number;
  ownerUsername: string;
  role: string | undefined;
  channels: Array<Channel> | undefined;
};
