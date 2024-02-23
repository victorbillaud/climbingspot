drop policy "Select" on "public"."blocks";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Enable read access for all users" on "public"."events";

drop policy "Enable select for users based on user_id" on "public"."friendship";

drop policy "Enable read access for all users" on "public"."reviews";

drop policy "Enable read access for all users" on "public"."spots";

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
  WHERE ((spots.status = 'Accepted'::spot_status) AND (NOT (EXISTS ( SELECT 1
           FROM blocks
          WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = spots.creator)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = spots.creator)))))))
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
  WHERE ((spots.status = 'Accepted'::spot_status) AND (NOT (EXISTS ( SELECT 1
           FROM blocks
          WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = spots.creator)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = spots.creator)))))))
  ORDER BY ( SELECT (avg(reviews.note))::double precision AS avg
           FROM reviews
          WHERE (reviews.spot_id = spots.id));


create policy "Enable delete for users based on user_id"
on "public"."blocks"
as permissive
for delete
to authenticated
using ((blocker_id = auth.uid()));


create policy "Enable read access for all users"
on "public"."blocks"
as permissive
for select
to authenticated
using (((blocked_id = auth.uid()) OR (blocker_id = auth.uid())));


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using ((true AND (NOT (EXISTS ( SELECT 1
   FROM blocks
  WHERE ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = profiles.id)))))));


create policy "Enable read access for all users"
on "public"."events"
as permissive
for select
to public
using ((true AND (NOT (EXISTS ( SELECT 1
   FROM blocks
  WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = events.creator_id)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = events.creator_id))))))));


create policy "Enable select for users based on user_id"
on "public"."friendship"
as permissive
for select
to authenticated
using ((((auth.uid() = sender_id) OR (auth.uid() = receiver_id)) AND (NOT (EXISTS ( SELECT 1
   FROM blocks
  WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = friendship.sender_id)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = friendship.sender_id)) OR ((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = friendship.receiver_id)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = friendship.receiver_id))))))));


create policy "Enable read access for all users"
on "public"."reviews"
as permissive
for select
to public
using ((true AND (NOT (EXISTS ( SELECT 1
   FROM blocks
  WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = reviews.creator_id)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = reviews.creator_id))))))));


create policy "Enable read access for all users"
on "public"."spots"
as permissive
for select
to public
using ((true AND (NOT (EXISTS ( SELECT 1
   FROM blocks
  WHERE (((blocks.blocker_id = auth.uid()) AND (blocks.blocked_id = spots.creator)) OR ((blocks.blocked_id = auth.uid()) AND (blocks.blocker_id = spots.creator))))))));

