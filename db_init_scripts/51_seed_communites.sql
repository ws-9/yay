INSERT INTO communities (name, owner_id)
SELECT v.name, u.id
FROM (
  VALUES
    ('community1', 'user'),
    ('community2', 'mod'),
    ('community3', 'admin'),
    ('community4', 'super_admin'),
    ('community5', 'disabled_user')
) AS v(name, owner_username)
JOIN users u ON u.username = v.owner_username;

INSERT INTO community_members (community_id, user_id)
SELECT c.id, u.id
FROM (
  VALUES
    ('community1', 'user'),
    ('community2', 'mod'),
    ('community3', 'admin'),
    ('community4', 'super_admin'),
    ('community5', 'disabled_user')
) AS v(name, owner_username)
JOIN communities c ON c.name = v.name
JOIN users u ON u.username = v.owner_username
WHERE c.owner_id = u.id
ON CONFLICT (community_id, user_id) DO NOTHING;