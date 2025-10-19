CREATE TABLE users (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(100) NOT NULL,
   enabled BOOLEAN NOT NULL
);

CREATE TABLE roles (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (user_id, role_id)
);

INSERT INTO users (username, password, enabled)
VALUES
    ('user', '{noop}password', true),
    ('mod', '{noop}password', true),
    ('admin', '{noop}password', true),
    ('super_admin', '{noop}password', true),
    ('disabled_user', '{noop}password', false);

INSERT INTO roles (name)
VALUES
    ('ROLE_USER'),
    ('ROLE_MOD'),
    ('ROLE_ADMIN'),
    ('ROLE_SUPER_ADMIN');

-- Assign users to roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'user' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'mod' AND r.name = 'ROLE_MOD';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'super_admin' AND r.name = 'ROLE_SUPER_ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'disabled_user' AND r.name = 'ROLE_USER';