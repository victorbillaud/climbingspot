alter table "public"."events" drop constraint "events_creator_id_fkey";

alter table "public"."friendships" drop constraint "friendships_creator_user_id_fkey";

alter table "public"."reviews" drop constraint "reviews_creator_id_fkey";

alter table "public"."reviews_likes" drop constraint "reviews_likes_profile_id_fkey";

alter table "public"."spots" drop constraint "spots_creator_fkey";

alter table "public"."spots" alter column "creator" drop not null;

alter table "public"."events" add constraint "events_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_creator_id_fkey";

alter table "public"."friendships" add constraint "friendships_creator_user_id_fkey" FOREIGN KEY (creator_user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friendships" validate constraint "friendships_creator_user_id_fkey";

alter table "public"."reviews" add constraint "reviews_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_creator_id_fkey";

alter table "public"."reviews_likes" add constraint "reviews_likes_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviews_likes" validate constraint "reviews_likes_profile_id_fkey";

alter table "public"."spots" add constraint "spots_creator_fkey" FOREIGN KEY (creator) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."spots" validate constraint "spots_creator_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user_account(delete_spots boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_exists BOOLEAN;
BEGIN
    IF auth.uid() = null THEN
        RAISE EXCEPTION 'No user connected';
    END IF;

    -- Check if the user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = auth.uid()) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE EXCEPTION 'User does not exist.';
    END IF;
    
    -- If the user decides to delete their spots, delete them first
    IF delete_spots THEN
        DELETE FROM public.spots WHERE creator = auth.uid();
    END IF;
    
    -- Then, delete the user's account
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$function$
;

create policy "Enable delete for users based on user_id"
on "public"."events"
as permissive
for delete
to authenticated
using ((auth.uid() = creator_id));


create policy "Enable delete for users based on user_id"
on "public"."spots"
as permissive
for delete
to authenticated
using ((auth.uid() = creator));



