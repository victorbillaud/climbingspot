set check_function_bodies = off;

create or replace view "public"."event_search_view" as  SELECT events.id,
    events.name,
    events.description,
    events.start_at,
    events.places,
    locations.city,
    locations.department,
    locations.country
   FROM ((events
     JOIN spots ON ((spots.id = events.spot_id)))
     JOIN locations ON ((locations.id = spots.location)));


CREATE OR REPLACE FUNCTION public.search_events(keyword text)
 RETURNS SETOF event_search_view
 LANGUAGE sql
AS $function$WITH ranked_results AS (
  SELECT
    *,
    (
      CASE
        WHEN name ILIKE '%' || keyword || '%' THEN 1.0
        WHEN description ILIKE '%' || keyword || '%' THEN 0.8
        WHEN city ILIKE '%' || keyword || '%' THEN 0.6
        WHEN department ILIKE '%' || keyword || '%' THEN 0.4
      END
    ) AS rank
  FROM
    event_search_view
  WHERE
    name ILIKE '%' || keyword || '%'
    OR description ILIKE '%' || keyword || '%'
    OR city ILIKE '%' || keyword || '%'
    OR department ILIKE '%' || keyword || '%'
)
SELECT
  id,
  name,
  description,
  start_at,
  places,
  city,
  department,
  country
FROM
  ranked_results
WHERE
  rank >= 0.05
ORDER BY
  rank DESC;
$function$
;


