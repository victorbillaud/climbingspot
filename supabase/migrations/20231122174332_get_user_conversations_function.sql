set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_conversations(requested_user_id uuid)
 RETURNS TABLE(event_id uuid, event_name text, participants jsonb, last_message jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    e.id AS event_id,
    e.name AS event_name,
    jsonb_agg(jsonb_build_object('id', p.id, 'avatar_url', p.avatar_url, 'full_name', p.full_name, 'username', p.username)) AS participants,
    (
      SELECT jsonb_build_object(
        'content', m.content,
        'user', jsonb_build_object('id', pm.id, 'avatar_url', pm.avatar_url, 'full_name', pm.full_name, 'username', pm.username)
      )
      FROM messages m
      JOIN profiles pm ON m.user_id = pm.id
      WHERE m.event_id = e.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message
  FROM
    events e
    JOIN events_participations ep ON e.id = ep.event_id AND ep.user_id = requested_user_id
    JOIN events_participations ep_all ON e.id = ep_all.event_id
    JOIN profiles p ON ep_all.user_id = p.id
  GROUP BY e.id
  ORDER BY e.start_at ASC
  LIMIT 10;
END;
$function$
;


