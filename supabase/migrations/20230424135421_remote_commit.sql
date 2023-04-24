create type "auth"."code_challenge_method" as enum ('s256', 'plain');

create table "auth"."flow_state" (
    "id" uuid not null,
    "user_id" uuid,
    "auth_code" text not null,
    "code_challenge_method" auth.code_challenge_method not null,
    "code_challenge" text not null,
    "provider_type" text not null,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id);

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);

alter table "auth"."flow_state" add constraint "flow_state_pkey" PRIMARY KEY using index "flow_state_pkey";


drop trigger if exists "check_event_participation_delete" on "public"."events_participations";

alter table "public"."messages" drop constraint "messages_user_id_fkey";

alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";

CREATE TRIGGER check_event_participation_delete BEFORE DELETE ON public.events_participations FOR EACH ROW EXECUTE FUNCTION check_event_participation_delete_trigger();
ALTER TABLE "public"."events_participations" DISABLE TRIGGER "check_event_participation_delete";


create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Auth 1ffg0oo_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'images'::text));


create policy "Auth 1ffg0oo_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'images'::text));


create policy "Auth 1ffg0oo_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'images'::text));


create policy "Auth 1ffg0oo_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'images'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Give anon users access to JPG images in folder 1ffg0oo_0"
on "storage"."objects"
as permissive
for select
to anon
using (((bucket_id = 'images'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));



