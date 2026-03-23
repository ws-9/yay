export const queryKeysV1 = {
  bootstrap: ['bootstrap'] as const,
  me: ['me'] as const,
  communities: {
    all: ['communities'] as const,
    myCommunities: ['communities', 'my-communities'] as const,
    detail: (id: number) => ['communities', id] as const,
    members: {
      role: (communityId: number, userId: number) =>
        ['communities', communityId, 'members', userId, 'role'] as const,
      detail: (communityId: number) =>
        ['communities', communityId, 'members'] as const,
    },
    invites: {
      detail: (communityId: number) =>
        ['communities', communityId, 'invites'] as const,
    },
  },
  channels: {
    detail: (id: number) => ['channels', id] as const,
    messages: (id: number) => ['channels', id, 'messages'] as const,
    permissions: (id: number) => ['channels', id, 'permissions'] as const,
  },
} as const;

export const queryKeysV2 = {
  bootstrap: ['v2', 'bootstrap'] as const,
  me: ['v2', 'me'] as const,
  users: {
    detail: (id: number) => ['v2', 'users', id] as const,
    batch: (ids: number[]) => ['v2', 'users', 'batch', [...ids].sort()] as const,
  },
  roles: {
    all: ['v2', 'roles'] as const,
  },
  communities: {
    all: ['v2', 'communities'] as const,
    joined: ['v2', 'communities', { joined: true }] as const,
    detail: (id: number) => ['v2', 'communities', id] as const,
    batch: (ids: number[]) =>
      ['v2', 'communities', 'batch', [...ids].sort()] as const,
  },
  channels: {
    detail: (id: number) => ['v2', 'channels', id] as const,
    byCommunity: (communityIds: number[]) =>
      ['v2', 'channels', { communityIds: [...communityIds].sort() }] as const,
    batch: (ids: number[]) =>
      ['v2', 'channels', 'batch', [...ids].sort()] as const,
  },
  members: {
    byCommunity: (communityId: number) =>
      ['v2', 'members', { communityId }] as const,
    detail: (communityId: number, userId: number | 'me') =>
      ['v2', 'members', { communityId, userId }] as const,
  },
  messages: {
    detail: (id: number) => ['v2', 'messages', id] as const,
    byChannel: (channelId: number) =>
      ['v2', 'messages', { channelId }] as const,
  },
  channelPermissions: {
    all: (communityIds: number[]) =>
      ['v2', 'channel-permissions', { communityIds: [...communityIds].sort() }] as const,
    detail: (channelId: number, roleId: number) =>
      ['v2', 'channel-permissions', { channelId, roleId }] as const,
  },
  invites: {
    byCommunity: (communityId: number) =>
      ['v2', 'invites', { communityId }] as const,
  },
} as const;
