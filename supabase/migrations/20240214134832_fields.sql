alter table "public"."events_invitations" alter column "status" drop default;

alter table "public"."events_participations" alter column "status" drop default;

alter table "public"."friendships" alter column "status" drop default;

alter type "public"."invitation_status" rename to "invitation_status__old_version_to_be_dropped";

create type "public"."invitation_status" as enum ('Pending', 'Accepted', 'Declined', 'Creator');

alter table "public"."events_invitations" alter column status type "public"."invitation_status" using status::text::"public"."invitation_status";

alter table "public"."events_participations" alter column status type "public"."invitation_status" using status::text::"public"."invitation_status";

alter table "public"."friendships" alter column status type "public"."invitation_status" using status::text::"public"."invitation_status";

alter table "public"."events_invitations" alter column "status" set default 'Pending'::invitation_status;

alter table "public"."events_participations" alter column "status" set default 'Pending'::invitation_status;

alter table "public"."friendships" alter column "status" set default 'Pending'::invitation_status;

drop type "public"."invitation_status__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_participation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO events_participations (user_id, event_id, status)
  VALUES (NEW.creator_id, NEW.id, 'Creator');
  RETURN NEW;
END;
$function$
;


