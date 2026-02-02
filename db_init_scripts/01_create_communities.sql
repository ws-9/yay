CREATE TABLE communities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    settings JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE community_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    hierarchy_level INT UNIQUE NOT NULL, -- Lower = more powerful (1 = highest)
    can_manage_channels BOOLEAN NOT NULL DEFAULT false, -- add, edit, delete channels
    can_ban_users BOOLEAN NOT NULL DEFAULT false, -- kick/ban users
    can_manage_roles BOOLEAN NOT NULL DEFAULT false, -- can assign or remove moderator roles
    can_delete_messages BOOLEAN NOT NULL DEFAULT false,
    can_manage_community_settings BOOLEAN NOT NULL DEFAULT false -- edit community name, description, etc.
);

CREATE TABLE community_members (
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    role_id BIGINT NOT NULL REFERENCES community_roles(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE banned_users (
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (community_id, user_id)
);