create type "public"."spot_status" as enum ('Pending', 'Accepted');

drop policy "Enable insert for authenticated users only" on "public"."spots";

drop policy "Enable read access for all users" on "public"."spots";

drop policy "Update" on "public"."spots";

alter table "public"."spots" add column "status" spot_status not null default 'Pending'::spot_status;

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
  WHERE (spots.status = 'Accepted'::spot_status)
  GROUP BY spots.id;


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
  WHERE (spots.status = 'Accepted'::spot_status)
  ORDER BY ( SELECT (avg(reviews.note))::double precision AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id));


create policy "Enable insert for authenticated users only"
on "public"."spots"
as permissive
for insert
to authenticated
with check ((status = 'Pending'::spot_status));


create policy "Enable read access for all users"
on "public"."spots"
as permissive
for select
to public
using (((status = 'Accepted'::spot_status) OR (creator = auth.uid())));


create policy "Update"
on "public"."spots"
as permissive
for update
to authenticated
using (((auth.uid() = creator) AND (status = 'Accepted'::spot_status)))
with check (((auth.uid() = creator) AND (status = 'Accepted'::spot_status)));


CREATE TRIGGER spot_creation_webhook AFTER INSERT ON public.spots FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://pbtxcelbykjcjukklxqk.supabase.co/functions/v1/trigger-spot-creation', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidHhjZWxieWtqY2p1a2tseHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyNjQ2MTAsImV4cCI6MTk5Mzg0MDYxMH0.QySWhy7YMluzM-Z-Erg-LZNNEc6yRLoq-ept8NuICBw"}', '{}', '1000');


