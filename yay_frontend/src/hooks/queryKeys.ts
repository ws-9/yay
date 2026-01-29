export const queryKeys = {
  bootstrap: ['bootstrap'] as const,
  me: ['me'] as const,
  communities: {
    all: ['communities'] as const,
    myCommunities: ['communities', 'my-communities'] as const,
    detail: (id: number) => ['communities', id] as const,
    members: {
      role: (communityId: number, userId: number) =>
        ['communities', communityId, 'members', userId, 'role'] as const,
    },
  },
  channels: {
    detail: (id: number) => ['channels', id] as const,
    messages: (id: number) => ['channels', id, 'messages'] as const,
  },
} as const;