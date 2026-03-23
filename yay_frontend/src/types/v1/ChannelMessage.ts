export type ChannelMessage = {
  id: number;
  message: string;
  userId: number;
  username: string;
  channelId: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
