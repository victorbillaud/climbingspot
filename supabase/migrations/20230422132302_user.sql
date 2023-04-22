create or replace view "public"."reviews_with_like_count" as  SELECT r.id,
    r.created_at,
    r.updated_at,
    r.title,
    r.content,
    r.creator_id,
    r.spot_id,
    r.note,
    count(rl.id) AS like_count
   FROM ((reviews r
     LEFT JOIN profiles p ON ((r.creator_id = p.id)))
     LEFT JOIN reviews_likes rl ON ((r.id = rl.review_id)))
  GROUP BY r.id, r.content, r.created_at, p.avatar_url, p.username;



