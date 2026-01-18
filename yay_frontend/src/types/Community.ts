import type { Channel } from './Channel';

export type Community = {
  id: string;
  name: string;
  ownerId: number;
  ownerUsername: string;
  role: string | undefined;
  channels: Array<Channel> | undefined;
};
