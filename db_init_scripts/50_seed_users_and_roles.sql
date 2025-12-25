INSERT INTO users (username, password, enabled)
VALUES
    ('user', '{noop}password', true),
    ('alice', '{noop}password', true),
    ('bob', '{noop}password', true),
    ('charlie', '{noop}password', true),
    ('diana', '{noop}password', true),
    ('eve', '{noop}password', true),
    ('frank', '{noop}password', true),
    ('grace', '{noop}password', true),
    ('henry', '{noop}password', true),
    ('iris', '{noop}password', true),
    ('banned', '{noop}password', true),
    ('disabled', '{noop}password', false),
    ('admin', '{noop}password', true);

INSERT INTO roles (name)
VALUES
    ('ROLE_USER'),
    ('ROLE_ADMIN');

-- Assign users to roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'user' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'alice' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'bob' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'charlie' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'diana' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'eve' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'frank' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'grace' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'henry' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'iris' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'banned' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'disabled' AND r.name = 'ROLE_USER';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';