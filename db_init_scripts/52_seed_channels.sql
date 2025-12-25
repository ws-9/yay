-- Seed channels with hobby-themed names for each community
INSERT INTO channels (name, community_id)
SELECT v.channel_name, c.id
FROM (VALUES
	('user''s community', 'general'),
	('user''s community', 'gaming'),
	('user''s community', 'music'),
	('user''s community', 'movies'),
	('alice''s community', 'general'),
	('alice''s community', 'cooking'),
	('alice''s community', 'fitness'),
	('alice''s community', 'books'),
	('bob''s community', 'general'),
	('bob''s community', 'travel'),
	('bob''s community', 'photography'),
	('bob''s community', 'tech'),
	('charlie''s community', 'general'),
	('charlie''s community', 'art'),
	('charlie''s community', 'design'),
	('charlie''s community', 'crafts'),
	('diana''s community', 'general'),
	('diana''s community', 'gardening'),
	('diana''s community', 'hiking'),
	('diana''s community', 'outdoors'),
	('eve''s community', 'general'),
	('eve''s community', 'coffee'),
	('eve''s community', 'tea'),
	('eve''s community', 'baking'),
	('frank''s community', 'general'),
	('frank''s community', 'sports'),
	('frank''s community', 'fitness'),
	('frank''s community', 'esports'),
	('grace''s community', 'general'),
	('grace''s community', 'writing'),
	('grace''s community', 'poetry'),
	('grace''s community', 'literature'),
	('henry''s community', 'general'),
	('henry''s community', 'movies'),
	('henry''s community', 'tv-shows'),
	('henry''s community', 'documentaries'),
	('iris''s community', 'general'),
	('iris''s community', 'music'),
	('iris''s community', 'concerts'),
	('iris''s community', 'vinyl')
) AS v(community_name, channel_name)
JOIN communities c ON c.name = v.community_name;

-- Seed channel messages from community members
INSERT INTO channel_messages (message, user_id, channel_id)
-- user's community - general
SELECT 'Welcome to the general channel!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
SELECT 'Hey everyone!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
SELECT 'Looking forward to chatting here!', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
-- user's community - gaming
SELECT 'What''s everyone playing these days?', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'gaming' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
SELECT 'Just finished a great campaign!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'gaming' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
SELECT 'Anyone want to play multiplayer?', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'gaming' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
-- user's community - music
SELECT 'New album dropped today!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'music' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
SELECT 'Who''s your favorite artist?', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'music' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
-- user's community - movies
SELECT 'Just watched an amazing film!', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'movies' AND c.community_id = (SELECT id FROM communities WHERE name = 'user''s community')
UNION ALL
-- alice's community - general
SELECT 'Hi folks!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
SELECT 'Great to have everyone here', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
SELECT 'Looking forward to great discussions!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
-- alice's community - cooking
SELECT 'Made a delicious pasta today!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'cooking' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
SELECT 'What''s your favorite recipe?', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'cooking' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
SELECT 'Just tried a new technique', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'cooking' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
-- alice's community - fitness
SELECT 'Got a great workout in today!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'fitness' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
SELECT 'Anyone training for something?', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'fitness' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
-- alice's community - books
SELECT 'Currently reading an amazing book!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'books' AND c.community_id = (SELECT id FROM communities WHERE name = 'alice''s community')
UNION ALL
-- bob's community - general
SELECT 'Welcome to my space!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
SELECT 'Happy to be here!', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
-- bob's community - travel
SELECT 'Just got back from a trip!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'travel' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
SELECT 'Where should I visit next?', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'travel' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
SELECT 'Europe is amazing', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'travel' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
-- bob's community - photography
SELECT 'Took some beautiful shots today!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'photography' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
SELECT 'Landscape photography is my passion', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'photography' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
-- bob's community - tech
SELECT 'New framework just dropped!', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'tech' AND c.community_id = (SELECT id FROM communities WHERE name = 'bob''s community')
UNION ALL
-- charlie's community - general
SELECT 'Hey team!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
SELECT 'Excited to join!', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
-- charlie's community - art
SELECT 'Just finished a new piece!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'art' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
SELECT 'What medium do you prefer?', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'art' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
-- charlie's community - design
SELECT 'Design is everywhere!', u.id, c.id FROM users u, channels c WHERE u.username = 'frank' AND c.name = 'design' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
-- charlie's community - crafts
SELECT 'Making something cool with my hands!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'crafts' AND c.community_id = (SELECT id FROM communities WHERE name = 'charlie''s community')
UNION ALL
-- diana's community - general
SELECT 'Welcome everyone!', u.id, c.id FROM users u, channels c WHERE u.username = 'frank' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
SELECT 'Glad to be part of this', u.id, c.id FROM users u, channels c WHERE u.username = 'grace' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
-- diana's community - gardening
SELECT 'My plants are thriving!', u.id, c.id FROM users u, channels c WHERE u.username = 'frank' AND c.name = 'gardening' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
SELECT 'Growing vegetables this season', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'gardening' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
-- diana's community - hiking
SELECT 'Mountain views are incredible!', u.id, c.id FROM users u, channels c WHERE u.username = 'grace' AND c.name = 'hiking' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
SELECT 'Anyone want to hike this weekend?', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'hiking' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
-- diana's community - outdoors
SELECT 'Nothing beats being outside!', u.id, c.id FROM users u, channels c WHERE u.username = 'frank' AND c.name = 'outdoors' AND c.community_id = (SELECT id FROM communities WHERE name = 'diana''s community')
UNION ALL
-- eve's community - general
SELECT 'Welcome to our space!', u.id, c.id FROM users u, channels c WHERE u.username = 'grace' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
SELECT 'Great to connect!', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
-- eve's community - coffee
SELECT 'Just made the perfect espresso!', u.id, c.id FROM users u, channels c WHERE u.username = 'grace' AND c.name = 'coffee' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
SELECT 'What''s your coffee order?', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'coffee' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
SELECT 'Love trying new roasts', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'coffee' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
-- eve's community - tea
SELECT 'Brewing some green tea now', u.id, c.id FROM users u, channels c WHERE u.username = 'grace' AND c.name = 'tea' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
-- eve's community - baking
SELECT 'Made fresh bread this morning!', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'baking' AND c.community_id = (SELECT id FROM communities WHERE name = 'eve''s community')
UNION ALL
-- frank's community - general
SELECT 'Hey everyone!', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
SELECT 'Excited to be here!', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
-- frank's community - sports
SELECT 'Game day is the best!', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'sports' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
SELECT 'Who''s your favorite team?', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'sports' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
SELECT 'Just watched an amazing match!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'sports' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
-- frank's community - fitness
SELECT 'Hit a new PR today!', u.id, c.id FROM users u, channels c WHERE u.username = 'henry' AND c.name = 'fitness' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
-- frank's community - esports
SELECT 'New season just started!', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'esports' AND c.community_id = (SELECT id FROM communities WHERE name = 'frank''s community')
UNION ALL
-- grace's community - general
SELECT 'Welcome to our community!', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
SELECT 'Happy to be here!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
SELECT 'Let''s have good conversations', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
-- grace's community - writing
SELECT 'Just finished a new piece!', u.id, c.id FROM users u, channels c WHERE u.username = 'iris' AND c.name = 'writing' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
SELECT 'Writing is my passion', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'writing' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
-- grace's community - poetry
SELECT 'Haiku time!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'poetry' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
-- grace's community - literature
SELECT 'Classic novels are timeless!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'literature' AND c.community_id = (SELECT id FROM communities WHERE name = 'grace''s community')
UNION ALL
-- henry's community - general
SELECT 'Welcome to the community!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
SELECT 'Great to see everyone!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
-- henry's community - movies
SELECT 'Just watched a great film!', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'movies' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
SELECT 'Movie night recommendations?', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'movies' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
-- henry's community - tv-shows
SELECT 'Started a new series!', u.id, c.id FROM users u, channels c WHERE u.username = 'user' AND c.name = 'tv-shows' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
-- henry's community - documentaries
SELECT 'Documentaries are so educational!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'documentaries' AND c.community_id = (SELECT id FROM communities WHERE name = 'henry''s community')
UNION ALL
-- iris's community - general
SELECT 'Welcome everyone!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
SELECT 'So glad to be here!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
SELECT 'Looking forward to chatting!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'general' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
-- iris's community - music
SELECT 'New album release today!', u.id, c.id FROM users u, channels c WHERE u.username = 'alice' AND c.name = 'music' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
SELECT 'What are you listening to?', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'music' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
-- iris's community - concerts
SELECT 'Going to a concert next month!', u.id, c.id FROM users u, channels c WHERE u.username = 'bob' AND c.name = 'concerts' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
SELECT 'Live music is amazing!', u.id, c.id FROM users u, channels c WHERE u.username = 'charlie' AND c.name = 'concerts' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
-- iris's community - vinyl
SELECT 'Just got a rare vinyl!', u.id, c.id FROM users u, channels c WHERE u.username = 'diana' AND c.name = 'vinyl' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community')
UNION ALL
SELECT 'Vinyl collection growing!', u.id, c.id FROM users u, channels c WHERE u.username = 'eve' AND c.name = 'vinyl' AND c.community_id = (SELECT id FROM communities WHERE name = 'iris''s community');
