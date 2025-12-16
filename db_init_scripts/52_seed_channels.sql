-- Seed channels with generic names for each community
INSERT INTO channels (name, community_id)
SELECT v.channel_name, c.id
FROM (VALUES
	('community1', 'general'),
	('community1', 'random'),
	('community1', 'announcements'),
	('community2', 'general'),
	('community2', 'random'),
	('community2', 'support'),
	('community3', 'general'),
	('community3', 'support'),
	('community3', 'dev'),
	('community4', 'general'),
	('community4', 'dev'),
	('community4', 'announcements'),
	('community5', 'general')
) AS v(community_name, channel_name)
JOIN communities c ON c.name = v.community_name
ON CONFLICT (name, community_id) DO NOTHING;

