drop policy "Enable delete for users based on user_id" on "public"."events_participations";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.can_delete_event_participation(p_user_id uuid, p_event_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.check_event_participation_delete_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF can_delete_event_participation(OLD.user_id, OLD.event_id) THEN
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Permission denied: You can only delete your own participation and event creators cannot delete their own participation.';
  END IF;
END;
$function$
;

create policy "Enable delete for users based on user_id"
on "public"."events_participations"
as permissive
for delete
to authenticated
using (true);


CREATE TRIGGER check_event_participation_delete BEFORE DELETE ON public.events_participations FOR EACH ROW EXECUTE FUNCTION check_event_participation_delete_trigger();


