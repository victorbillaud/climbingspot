create sequence "public"."test_tenant_id_seq";

create table "public"."test_tenant" (
    "id" integer not null default nextval('test_tenant_id_seq'::regclass),
    "details" text
);


alter sequence "public"."test_tenant_id_seq" owned by "public"."test_tenant"."id";

CREATE UNIQUE INDEX test_tenant_pkey ON public.test_tenant USING btree (id);

alter table "public"."test_tenant" add constraint "test_tenant_pkey" PRIMARY KEY using index "test_tenant_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_spots(keyword text)
 RETURNS SETOF spot_search_view
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
    spot_search_view
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
  type,
  difficulty,
  location_id,
  city,
  department,
  country,
  note,
  slug,
  image
FROM
  ranked_results
WHERE
  rank >= 0.05
ORDER BY
  rank DESC;
$function$
;

create or replace view "public"."spot_search_view" as  SELECT spots.id,
    spots.name,
    spots.description,
    spots.type,
    spots.difficulty,
    locations.id AS location_id,
    locations.city,
    locations.department,
    locations.country,
    ( SELECT (avg(reviews.note))::double precision AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id)) AS note,
    spots.slug,
    spots.image
   FROM (spots
     JOIN locations ON ((locations.id = spots.location)))
  ORDER BY ( SELECT (avg(reviews.note))::double precision AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id));


