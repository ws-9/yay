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