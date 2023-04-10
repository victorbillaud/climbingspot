create extension if not exists "unaccent" with schema "public" version '1.1';

drop view if exists "public"."spot_extanded_view";
drop view if exists "public"."spot_extended_view";

alter table "public"."spots" add column "slug" text;

CREATE UNIQUE INDEX spots_slug_key ON public.spots USING btree (slug);

alter table "public"."spots" add constraint "spots_slug_key" UNIQUE using index "spots_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_spot_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    country_name text;
    city_name text;
BEGIN
    SELECT c.name, l.city INTO country_name, city_name
    FROM locations l
    JOIN countries c ON l.country = c.id
    WHERE l.id = NEW.location;

    IF country_name IS NULL OR city_name IS NULL THEN
        NEW.slug := CONCAT('/spot/', slugify(NEW.name));
    ELSE
        NEW.slug := CONCAT('/spot/', slugify(country_name), '/', slugify(city_name), '/', slugify(NEW.name));
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.slugify(value text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '\\-+$', ''), '^\\-', '') AS "value"
    FROM "hyphenated"
  )
  SELECT "value" FROM "trimmed";
$function$
;

create or replace view "public"."spot_extended_view" as  SELECT spots.created_at,
    spots.updated_at,
    spots.name,
    spots.description,
    spots.image,
    spots.location,
    spots.type,
    spots.creator,
    spots.difficulty,
    spots.id,
    spots.approach,
    spots.period,
    spots.orientation,
    spots.rock_type,
    spots.cliff_height,
    spots.slug,
    (avg(reviews.note))::double precision AS note
   FROM (spots
     LEFT JOIN reviews ON ((spots.id = reviews.spot_id)))
  GROUP BY spots.id;


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
  slug
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
    (( SELECT avg(reviews.note) AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id)))::double precision AS note,
    spots.slug
   FROM (spots
     JOIN locations ON ((locations.id = spots.location)))
  ORDER BY ((( SELECT avg(reviews.note) AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id)))::double precision);


create policy "Enable read access for all users"
on "public"."countries"
as permissive
for select
to public
using (true);


CREATE TRIGGER spots_slug_generator BEFORE INSERT OR UPDATE ON public.spots FOR EACH ROW EXECUTE FUNCTION generate_spot_slug();

WITH spot_locations AS (
    SELECT
        s.id,
        c.name AS country_name,
        l.city AS city_name,
        s.name AS spot_name
    FROM
        public.spots s
        JOIN public.locations l ON s.location = l.id
        JOIN public.countries c ON l.country = c.id
)
UPDATE
    public.spots
SET
    slug = CONCAT(
        '/spot/',
        COALESCE(slugify(spot_locations.country_name) || '/', ''),
        COALESCE(slugify(spot_locations.city_name) || '/', ''),
        slugify(spot_locations.spot_name)
    )
FROM
    spot_locations
WHERE
    public.spots.id = spot_locations.id;


