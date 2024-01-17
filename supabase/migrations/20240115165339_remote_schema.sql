
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "next_auth";

create extension if not exists "unaccent" with schema "extensions";

ALTER SCHEMA "next_auth" OWNER TO "postgres";

CREATE TYPE "public"."continents" AS ENUM (
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
    'North America',
    'South America'
);

ALTER TYPE "public"."continents" OWNER TO "postgres";

CREATE TYPE "public"."difficulty" AS ENUM (
    'Easy',
    'Medium',
    'Hard'
);

ALTER TYPE "public"."difficulty" OWNER TO "postgres";

CREATE TYPE "public"."diffulty" AS ENUM (
    'Easy',
    'Medium',
    'Hard'
);

ALTER TYPE "public"."diffulty" OWNER TO "postgres";

CREATE TYPE "public"."invitation_status" AS ENUM (
    'Pending',
    'Accepted',
    'Declined'
);

ALTER TYPE "public"."invitation_status" OWNER TO "postgres";

CREATE TYPE "public"."month" AS ENUM (
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
);

ALTER TYPE "public"."month" OWNER TO "postgres";

CREATE TYPE "public"."orientation" AS ENUM (
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW'
);

ALTER TYPE "public"."orientation" OWNER TO "postgres";

CREATE TYPE "public"."type" AS ENUM (
    'Indoor',
    'Outdoor'
);

ALTER TYPE "public"."type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."can_delete_event_participation"("p_user_id" "uuid", "p_event_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  event_creator_id UUID;
BEGIN
  SELECT creator_id FROM events WHERE events.id = p_event_id INTO event_creator_id;
  RAISE LOG 'User ID to Delete: %, Authenticated User ID: %, Creator ID: %', p_user_id, auth.uid(), event_creator_id;

  IF (p_user_id = auth.uid() AND p_user_id <> event_creator_id) OR (auth.uid() = event_creator_id AND p_user_id <> auth.uid()) THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

ALTER FUNCTION "public"."can_delete_event_participation"("p_user_id" "uuid", "p_event_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_event_invitation_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM events_invitations WHERE user_id = NEW.user_id AND event_id = NEW.event_id) THEN
        RAISE EXCEPTION 'You are already register in this event';
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

ALTER FUNCTION "public"."check_event_invitation_trigger"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_event_participation_delete_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF can_delete_event_participation(OLD.user_id, OLD.event_id) THEN
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Permission denied: You can only delete your own participation and event creators cannot delete their own participation.';
  END IF;
END;
$$;

ALTER FUNCTION "public"."check_event_participation_delete_trigger"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_event_participation_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM events_participations WHERE user_id = NEW.user_id AND event_id = NEW.event_id) THEN
        RAISE EXCEPTION 'You are already register in this event';
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

ALTER FUNCTION "public"."check_event_participation_trigger"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_review_like"("user_id" integer, "spot_id" integer) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    IF EXISTS (SELECT 1 FROM review_like WHERE user_id = $1 AND spot_id = $2) THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$_$;

ALTER FUNCTION "public"."check_review_like"("user_id" integer, "spot_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_review_like_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM reviews_likes WHERE profile_id = NEW.profile_id AND review_id = NEW.review_id) THEN
        RAISE EXCEPTION 'You have already like this review';
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

ALTER FUNCTION "public"."check_review_like_trigger"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."generate_spot_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    country_name text;
    city_name text;
    base_slug text;
BEGIN
    SELECT c.name, l.city INTO country_name, city_name
    FROM locations l
    JOIN countries c ON l.country = c.id
    WHERE l.id = NEW.location;

    IF country_name IS NULL OR city_name IS NULL THEN
        base_slug := CONCAT('/spot/', slugify(NEW.name));
    ELSE
        base_slug := CONCAT('/spot/', slugify(country_name), '/', slugify(city_name), '/', slugify(NEW.name));
    END IF;

    NEW.slug := generate_unique_slug(base_slug);

    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."generate_spot_slug"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."generate_unique_slug"("base_slug" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    new_slug text := base_slug;
    counter int := 1;
    slug_exists boolean := TRUE;
BEGIN
    WHILE slug_exists LOOP
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM spots WHERE slug = $1)')
        USING new_slug
        INTO slug_exists;

        IF slug_exists THEN
            new_slug := base_slug || '-' || counter;
            counter := counter + 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;

    RETURN new_slug;
END;
$_$;

ALTER FUNCTION "public"."generate_unique_slug"("base_slug" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_clusters"("min_latitude" numeric, "max_latitude" numeric, "min_longitude" numeric, "max_longitude" numeric) RETURNS TABLE("result" "json")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    spot_count INT;
BEGIN
    -- Get the count of spots within the specified bounds
    SELECT COUNT(*)
    INTO spot_count
    FROM spots
    JOIN locations ON spots.location = locations.id
    WHERE locations.latitude BETWEEN min_latitude AND max_latitude
      AND locations.longitude BETWEEN min_longitude AND max_longitude;

    IF spot_count > 100 THEN
        -- Cluster the data if the result exceeds 100 items
        RETURN QUERY
        WITH spots AS (
            SELECT spots.id, locations.latitude, locations.longitude
            FROM spots
            JOIN locations ON spots.location = locations.id
            WHERE locations.latitude BETWEEN min_latitude AND max_latitude
              AND locations.longitude BETWEEN min_longitude AND max_longitude
        ),
        clusters AS (
            SELECT id, kmeans(latitude, longitude) OVER() as cluster_id
            FROM spots
        ),
        aggregated_clusters AS (
            SELECT cluster_id,
                   AVG(latitude) AS average_latitude,
                   AVG(longitude) AS average_longitude,
                   COUNT(*) AS count
            FROM spots
            JOIN clusters ON spots.id = clusters.id
            GROUP BY cluster_id
        )
        SELECT json_agg(json_build_object(
            'cluster_id', cluster_id,
            'average_latitude', average_latitude,
            'average_longitude', average_longitude,
            'count', count
        ))
        FROM aggregated_clusters;
    ELSE
        -- Return the individual spots as a single cluster
        RETURN QUERY
        WITH individual_spots AS (
            SELECT locations.latitude, locations.longitude
            FROM spots
            JOIN locations ON spots.location = locations.id
            WHERE locations.latitude BETWEEN min_latitude AND max_latitude
              AND locations.longitude BETWEEN min_longitude AND max_longitude
        ),
        aggregated_spots AS (
            SELECT 1 as cluster_id,
                   AVG(latitude) AS average_latitude,
                   AVG(longitude) AS average_longitude,
                   COUNT(*) AS count
            FROM individual_spots
        )
        SELECT json_agg(json_build_object(
            'cluster_id', cluster_id,
            'average_latitude', average_latitude,
            'average_longitude', average_longitude,
            'count', count
        ))
        FROM aggregated_spots;
    END IF;
END;
$$;

ALTER FUNCTION "public"."get_clusters"("min_latitude" numeric, "max_latitude" numeric, "min_longitude" numeric, "max_longitude" numeric) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_conversations"("requested_user_id" "uuid") RETURNS TABLE("event_id" "uuid", "event_name" "text", "participants" "jsonb", "last_message" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $$
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
$$;

ALTER FUNCTION "public"."get_user_conversations"("requested_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_participation"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO events_participations (user_id, event_id)
  VALUES (NEW.creator_id, NEW.id);
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."insert_participation"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."events" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "start_at" timestamp with time zone NOT NULL,
    "end_at" timestamp with time zone,
    "spot_id" "uuid" NOT NULL,
    "creator_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "places" smallint DEFAULT '5'::smallint NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."events" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "city" "text",
    "department" "text" DEFAULT ''::"text",
    "country" bigint,
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL
);

ALTER TABLE "public"."locations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."spots" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "image" "text"[],
    "location" bigint NOT NULL,
    "type" "public"."type" NOT NULL,
    "creator" "uuid" NOT NULL,
    "difficulty" "public"."difficulty" NOT NULL,
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "approach" "text",
    "period" "public"."month"[],
    "orientation" "public"."orientation"[],
    "rock_type" "text",
    "cliff_height" smallint,
    "slug" "text"
);

ALTER TABLE "public"."spots" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."event_search_view" AS
 SELECT "events"."id",
    "events"."name",
    "events"."description",
    "events"."start_at",
    "events"."places",
    "locations"."city",
    "locations"."department",
    "locations"."country"
   FROM (("public"."events"
     JOIN "public"."spots" ON (("spots"."id" = "events"."spot_id")))
     JOIN "public"."locations" ON (("locations"."id" = "spots"."location")));

ALTER TABLE "public"."event_search_view" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_events"("keyword" "text") RETURNS SETOF "public"."event_search_view"
    LANGUAGE "sql"
    AS $$WITH ranked_results AS (
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
$$;

ALTER FUNCTION "public"."search_events"("keyword" "text") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" "text",
    "content" "text",
    "creator_id" "uuid" NOT NULL,
    "spot_id" "uuid" NOT NULL,
    "note" smallint
);

ALTER TABLE "public"."reviews" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."spot_search_view" AS
 SELECT "spots"."id",
    "spots"."name",
    "spots"."description",
    "spots"."type",
    "spots"."difficulty",
    "locations"."id" AS "location_id",
    "locations"."city",
    "locations"."department",
    "locations"."country",
    ( SELECT ("avg"("reviews"."note"))::double precision AS "avg"
           FROM "public"."reviews"
          WHERE ("reviews"."spot_id" = "spots"."id")) AS "note",
    "spots"."slug",
    "spots"."image"
   FROM ("public"."spots"
     JOIN "public"."locations" ON (("locations"."id" = "spots"."location")))
  ORDER BY ( SELECT ("avg"("reviews"."note"))::double precision AS "avg"
           FROM "public"."reviews"
          WHERE ("reviews"."spot_id" = "spots"."id"));

ALTER TABLE "public"."spot_search_view" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_spots"("keyword" "text") RETURNS SETOF "public"."spot_search_view"
    LANGUAGE "sql"
    AS $$WITH ranked_results AS (
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
$$;

ALTER FUNCTION "public"."search_spots"("keyword" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_spots_within_bounds"("latitude_gte" double precision, "latitude_lte" double precision, "longitude_gte" double precision, "longitude_lte" double precision) RETURNS TABLE("id" "uuid", "name" character varying, "latitude" double precision, "longitude" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, l.latitude, l.longitude
  FROM public.spots s
  JOIN public.locations l ON s.location = l.id
  WHERE l.latitude >= latitude_gte
    AND l.latitude <= latitude_lte
    AND l.longitude >= longitude_gte
    AND l.longitude <= longitude_lte;
END;
$$;

ALTER FUNCTION "public"."search_spots_within_bounds"("latitude_gte" double precision, "latitude_lte" double precision, "longitude_gte" double precision, "longitude_lte" double precision) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."slugify"("value" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
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
$_$;

ALTER FUNCTION "public"."slugify"("value" "text") OWNER TO "postgres";

ALTER TABLE "public"."locations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Location_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" bigint NOT NULL,
    "name" "text",
    "iso2" "text" NOT NULL,
    "iso3" "text",
    "local_name" "text",
    "continent" "public"."continents"
);

ALTER TABLE "public"."countries" OWNER TO "postgres";

ALTER TABLE "public"."countries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."countries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    "expo_push_id" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reviews_likes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid" NOT NULL,
    "review_id" "uuid" NOT NULL
);

ALTER TABLE "public"."reviews_likes" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."detailed_review" AS
 SELECT "reviews"."id",
    "reviews"."created_at",
    "reviews"."updated_at",
    "reviews"."title",
    "reviews"."content",
    "reviews"."creator_id",
    "reviews"."spot_id",
    "reviews"."note",
    ( SELECT "count"(*) AS "count"
           FROM "public"."reviews_likes"
          WHERE ("reviews_likes"."review_id" = "reviews"."id")) AS "like_count",
    "creator"."avatar_url" AS "creator_avatar_url"
   FROM ("public"."reviews"
     LEFT JOIN "public"."profiles" "creator" ON (("creator"."id" = "reviews"."creator_id")));

ALTER TABLE "public"."detailed_review" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."event_extanded_view" AS
 SELECT "e"."id",
    "e"."created_at",
    "e"."updated_at",
    "e"."name",
    "e"."start_at",
    "e"."end_at",
    "json_build_object"('avatar_url', "p"."avatar_url", 'username', "p"."username") AS "creator"
   FROM ("public"."events" "e"
     JOIN "public"."profiles" "p" ON (("e"."creator_id" = "p"."id")));

ALTER TABLE "public"."event_extanded_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events_invitations" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "event_participation_id" "uuid",
    "status" "public"."invitation_status" DEFAULT 'Pending'::"public"."invitation_status",
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);

ALTER TABLE "public"."events_invitations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events_participations" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."invitation_status" DEFAULT 'Pending'::"public"."invitation_status",
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);

ALTER TABLE "public"."events_participations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."friendships" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "first_user_id" "uuid" NOT NULL,
    "second_user_id" "uuid" NOT NULL,
    "creator_user_id" "uuid" NOT NULL,
    "status" "public"."invitation_status" DEFAULT 'Pending'::"public"."invitation_status" NOT NULL
);

ALTER TABLE "public"."friendships" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "content" "text" NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."notification" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "data" "json",
    "subtitle" "text"
);

ALTER TABLE "public"."notification" OWNER TO "postgres";

ALTER TABLE "public"."reviews_likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."review_like_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."reviews_with_like_count" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::"text" AS "title",
    NULL::"text" AS "content",
    NULL::"uuid" AS "creator_id",
    NULL::"uuid" AS "spot_id",
    NULL::smallint AS "note",
    NULL::bigint AS "like_count";

ALTER TABLE "public"."reviews_with_like_count" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."spot_extended_view" AS
SELECT
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::character varying AS "name",
    NULL::"text" AS "description",
    NULL::"text"[] AS "image",
    NULL::bigint AS "location",
    NULL::"public"."type" AS "type",
    NULL::"uuid" AS "creator",
    NULL::"public"."difficulty" AS "difficulty",
    NULL::"uuid" AS "id",
    NULL::"text" AS "approach",
    NULL::"public"."month"[] AS "period",
    NULL::"public"."orientation"[] AS "orientation",
    NULL::"text" AS "rock_type",
    NULL::smallint AS "cliff_height",
    NULL::"text" AS "slug",
    NULL::double precision AS "note";

ALTER TABLE "public"."spot_extended_view" OWNER TO "postgres";

ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "Friendships_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."events_invitations"
    ADD CONSTRAINT "events_invitations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."events_participations"
    ADD CONSTRAINT "events_participations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."reviews_likes"
    ADD CONSTRAINT "review_like_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."spots"
    ADD CONSTRAINT "spots_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."spots"
    ADD CONSTRAINT "spots_slug_key" UNIQUE ("slug");

CREATE INDEX "idx_events_creator_id" ON "public"."events" USING "btree" ("creator_id");

CREATE INDEX "idx_profiles_id" ON "public"."profiles" USING "btree" ("id");

CREATE OR REPLACE VIEW "public"."spot_extended_view" AS
 SELECT "spots"."created_at",
    "spots"."updated_at",
    "spots"."name",
    "spots"."description",
    "spots"."image",
    "spots"."location",
    "spots"."type",
    "spots"."creator",
    "spots"."difficulty",
    "spots"."id",
    "spots"."approach",
    "spots"."period",
    "spots"."orientation",
    "spots"."rock_type",
    "spots"."cliff_height",
    "spots"."slug",
    ("avg"("reviews"."note"))::double precision AS "note"
   FROM ("public"."spots"
     LEFT JOIN "public"."reviews" ON (("spots"."id" = "reviews"."spot_id")))
  GROUP BY "spots"."id";

CREATE OR REPLACE VIEW "public"."reviews_with_like_count" AS
 SELECT "r"."id",
    "r"."created_at",
    "r"."updated_at",
    "r"."title",
    "r"."content",
    "r"."creator_id",
    "r"."spot_id",
    "r"."note",
    "count"("rl"."id") AS "like_count"
   FROM (("public"."reviews" "r"
     LEFT JOIN "public"."profiles" "p" ON (("r"."creator_id" = "p"."id")))
     LEFT JOIN "public"."reviews_likes" "rl" ON (("r"."id" = "rl"."review_id")))
  GROUP BY "r"."id", "r"."content", "r"."created_at", "p"."avatar_url", "p"."username";

CREATE OR REPLACE TRIGGER "check_event_invitation" BEFORE INSERT ON "public"."events_invitations" FOR EACH ROW EXECUTE FUNCTION "public"."check_event_invitation_trigger"();

CREATE OR REPLACE TRIGGER "check_event_participation" BEFORE INSERT ON "public"."events_participations" FOR EACH ROW EXECUTE FUNCTION "public"."check_event_participation_trigger"();

CREATE OR REPLACE TRIGGER "check_event_participation_delete" BEFORE DELETE ON "public"."events_participations" FOR EACH ROW EXECUTE FUNCTION "public"."check_event_participation_delete_trigger"();

ALTER TABLE "public"."events_participations" DISABLE TRIGGER "check_event_participation_delete";

CREATE OR REPLACE TRIGGER "event_participation_webhook" AFTER INSERT OR DELETE OR UPDATE ON "public"."events_participations" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://pbtxcelbykjcjukklxqk.supabase.co/functions/v1/event-participation-trigger', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidHhjZWxieWtqY2p1a2tseHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyNjQ2MTAsImV4cCI6MTk5Mzg0MDYxMH0.QySWhy7YMluzM-Z-Erg-LZNNEc6yRLoq-ept8NuICBw"}', '{}', '1000');

CREATE OR REPLACE TRIGGER "message_insert_webhook" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://pbtxcelbykjcjukklxqk.supabase.co/functions/v1/message-trigger', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidHhjZWxieWtqY2p1a2tseHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyNjQ2MTAsImV4cCI6MTk5Mzg0MDYxMH0.QySWhy7YMluzM-Z-Erg-LZNNEc6yRLoq-ept8NuICBw"}', '{}', '1000');

CREATE OR REPLACE TRIGGER "new_event_trigger" AFTER INSERT ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."insert_participation"();

CREATE OR REPLACE TRIGGER "notification_insert_webhook" AFTER INSERT ON "public"."notification" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://pbtxcelbykjcjukklxqk.supabase.co/functions/v1/notify', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidHhjZWxieWtqY2p1a2tseHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyNjQ2MTAsImV4cCI6MTk5Mzg0MDYxMH0.QySWhy7YMluzM-Z-Erg-LZNNEc6yRLoq-ept8NuICBw"}', '{}', '1000');

CREATE OR REPLACE TRIGGER "review_like_check" BEFORE INSERT ON "public"."reviews_likes" FOR EACH ROW EXECUTE FUNCTION "public"."check_review_like_trigger"();

CREATE OR REPLACE TRIGGER "spots_slug_generator" BEFORE INSERT OR UPDATE ON "public"."spots" FOR EACH ROW EXECUTE FUNCTION "public"."generate_spot_slug"();

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."events_invitations"
    ADD CONSTRAINT "events_invitations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."events_invitations"
    ADD CONSTRAINT "events_invitations_event_participation_id_fkey" FOREIGN KEY ("event_participation_id") REFERENCES "public"."events_participations"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."events_invitations"
    ADD CONSTRAINT "events_invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."events_participations"
    ADD CONSTRAINT "events_participations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."events_participations"
    ADD CONSTRAINT "events_participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_first_user_id_fkey" FOREIGN KEY ("first_user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_second_user_id_fkey" FOREIGN KEY ("second_user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."countries"("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."reviews_likes"
    ADD CONSTRAINT "reviews_likes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."reviews_likes"
    ADD CONSTRAINT "reviews_likes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."spots"
    ADD CONSTRAINT "spots_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."spots"
    ADD CONSTRAINT "spots_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."locations"("id");

CREATE POLICY "Enable all access for service_role" ON "public"."notification" TO "service_role" USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."events_participations" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."friendships" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "first_user_id") OR ("auth"."uid"() = "second_user_id")));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."countries" FOR SELECT TO "anon" USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."events_invitations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."events_participations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."friendships" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() <> "second_user_id") AND ("second_user_id" <> "first_user_id")));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."locations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."reviews_likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."spots" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."countries" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."events_invitations" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."events_participations" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."locations" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."reviews" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."reviews_likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."spots" FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON "public"."friendships" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "first_user_id") OR ("auth"."uid"() = "second_user_id"))) WITH CHECK ((("auth"."uid"() = "first_user_id") OR ("auth"."uid"() = "second_user_id")));

CREATE POLICY "Enable update for users based on id" ON "public"."events" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "creator_id")) WITH CHECK (("auth"."uid"() = "creator_id"));

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Select" ON "public"."messages" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Update" ON "public"."spots" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "creator")) WITH CHECK (("auth"."uid"() = "creator"));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events_invitations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events_participations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."friendships" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notification" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reviews_likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."spots" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "next_auth" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."can_delete_event_participation"("p_user_id" "uuid", "p_event_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."can_delete_event_participation"("p_user_id" "uuid", "p_event_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_delete_event_participation"("p_user_id" "uuid", "p_event_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."check_event_invitation_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_event_invitation_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_event_invitation_trigger"() TO "service_role";

GRANT ALL ON FUNCTION "public"."check_event_participation_delete_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_event_participation_delete_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_event_participation_delete_trigger"() TO "service_role";

GRANT ALL ON FUNCTION "public"."check_event_participation_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_event_participation_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_event_participation_trigger"() TO "service_role";

GRANT ALL ON FUNCTION "public"."check_review_like"("user_id" integer, "spot_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."check_review_like"("user_id" integer, "spot_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_review_like"("user_id" integer, "spot_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."check_review_like_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_review_like_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_review_like_trigger"() TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_spot_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_spot_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_spot_slug"() TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_unique_slug"("base_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_slug"("base_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_slug"("base_slug" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_clusters"("min_latitude" numeric, "max_latitude" numeric, "min_longitude" numeric, "max_longitude" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."get_clusters"("min_latitude" numeric, "max_latitude" numeric, "min_longitude" numeric, "max_longitude" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_clusters"("min_latitude" numeric, "max_latitude" numeric, "min_longitude" numeric, "max_longitude" numeric) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_conversations"("requested_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_conversations"("requested_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_conversations"("requested_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_participation"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_participation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_participation"() TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";

GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";

GRANT ALL ON TABLE "public"."spots" TO "anon";
GRANT ALL ON TABLE "public"."spots" TO "authenticated";
GRANT ALL ON TABLE "public"."spots" TO "service_role";

GRANT ALL ON TABLE "public"."event_search_view" TO "anon";
GRANT ALL ON TABLE "public"."event_search_view" TO "authenticated";
GRANT ALL ON TABLE "public"."event_search_view" TO "service_role";

GRANT ALL ON FUNCTION "public"."search_events"("keyword" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_events"("keyword" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_events"("keyword" "text") TO "service_role";

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";

GRANT ALL ON TABLE "public"."spot_search_view" TO "anon";
GRANT ALL ON TABLE "public"."spot_search_view" TO "authenticated";
GRANT ALL ON TABLE "public"."spot_search_view" TO "service_role";

GRANT ALL ON FUNCTION "public"."search_spots"("keyword" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_spots"("keyword" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_spots"("keyword" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_spots_within_bounds"("latitude_gte" double precision, "latitude_lte" double precision, "longitude_gte" double precision, "longitude_lte" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."search_spots_within_bounds"("latitude_gte" double precision, "latitude_lte" double precision, "longitude_gte" double precision, "longitude_lte" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_spots_within_bounds"("latitude_gte" double precision, "latitude_lte" double precision, "longitude_gte" double precision, "longitude_lte" double precision) TO "service_role";

GRANT ALL ON FUNCTION "public"."slugify"("value" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."slugify"("value" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."slugify"("value" "text") TO "service_role";

GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."countries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."countries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."countries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."reviews_likes" TO "anon";
GRANT ALL ON TABLE "public"."reviews_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews_likes" TO "service_role";

GRANT ALL ON TABLE "public"."detailed_review" TO "anon";
GRANT ALL ON TABLE "public"."detailed_review" TO "authenticated";
GRANT ALL ON TABLE "public"."detailed_review" TO "service_role";

GRANT ALL ON TABLE "public"."event_extanded_view" TO "anon";
GRANT ALL ON TABLE "public"."event_extanded_view" TO "authenticated";
GRANT ALL ON TABLE "public"."event_extanded_view" TO "service_role";

GRANT ALL ON TABLE "public"."events_invitations" TO "anon";
GRANT ALL ON TABLE "public"."events_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."events_invitations" TO "service_role";

GRANT ALL ON TABLE "public"."events_participations" TO "anon";
GRANT ALL ON TABLE "public"."events_participations" TO "authenticated";
GRANT ALL ON TABLE "public"."events_participations" TO "service_role";

GRANT ALL ON TABLE "public"."friendships" TO "anon";
GRANT ALL ON TABLE "public"."friendships" TO "authenticated";
GRANT ALL ON TABLE "public"."friendships" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."notification" TO "anon";
GRANT ALL ON TABLE "public"."notification" TO "authenticated";
GRANT ALL ON TABLE "public"."notification" TO "service_role";

GRANT ALL ON SEQUENCE "public"."review_like_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."review_like_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."review_like_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."reviews_with_like_count" TO "anon";
GRANT ALL ON TABLE "public"."reviews_with_like_count" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews_with_like_count" TO "service_role";

GRANT ALL ON TABLE "public"."spot_extended_view" TO "anon";
GRANT ALL ON TABLE "public"."spot_extended_view" TO "authenticated";
GRANT ALL ON TABLE "public"."spot_extended_view" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
