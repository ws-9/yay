import type { Channel } from './Channel';

export type Community = {
  id: string;
  name: string;
  ownerId: number;
  ownerUsername: string;
  channels: Array<Channel> | undefined;
};
