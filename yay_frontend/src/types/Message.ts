export type Message = {
  id: number;
  message: string;
  userId: number;
  channelId: number;
  createdAt: string; // ISO-8601 string
  updatedAt?: string;
  deletedAt?: string;
};
