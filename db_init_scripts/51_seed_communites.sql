INSERT INTO communities (name, owner_id)
SELECT u.username || '''s community', u.id
FROM users u
WHERE u.username IN ('user', 'alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'grace', 'henry', 'iris');

-- Add community members (besides owners)
INSERT INTO community_members (community_id, user_id)
-- user's community: alice, bob, charlie
SELECT c.id, u.id FROM communities c, users u 
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'user') AND u.username IN ('alice', 'bob', 'charlie')
UNION ALL
-- alice's community: user, bob, diana
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'alice') AND u.username IN ('user', 'bob', 'diana')
UNION ALL
-- bob's community: alice, charlie, eve
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'bob') AND u.username IN ('alice', 'charlie', 'eve')
UNION ALL
-- charlie's community: diana, eve, frank
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'charlie') AND u.username IN ('diana', 'eve', 'frank')
UNION ALL
-- diana's community: frank, grace, henry
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'diana') AND u.username IN ('frank', 'grace', 'henry')
UNION ALL
-- eve's community: grace, henry, iris
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'eve') AND u.username IN ('grace', 'henry', 'iris')
UNION ALL
-- frank's community: henry, iris, user
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'frank') AND u.username IN ('henry', 'iris', 'user')
UNION ALL
-- grace's community: iris, user, alice
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'grace') AND u.username IN ('iris', 'user', 'alice')
UNION ALL
-- henry's community: user, bob, charlie, diana
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'henry') AND u.username IN ('user', 'bob', 'charlie', 'diana')
UNION ALL
-- iris's community: alice, bob, charlie, diana, eve
SELECT c.id, u.id FROM communities c, users u
WHERE c.owner_id = (SELECT id FROM users WHERE username = 'iris') AND u.username IN ('alice', 'bob', 'charlie', 'diana', 'eve');

-- Add community owners to their own communities
INSERT INTO community_members (community_id, user_id)
SELECT c.id, c.owner_id FROM communities c;

-- Add banned user to all communities
INSERT INTO banned_users (community_id, user_id)
SELECT c.id, (SELECT id FROM users WHERE username = 'banned')
FROM communities c;