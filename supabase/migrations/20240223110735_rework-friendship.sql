drop policy "Enable delete for users based on user_id" on "public"."friendships";

drop policy "Enable insert for authenticated users only" on "public"."friendships";

drop policy "Enable update for users based on email" on "public"."friendships";

revoke delete on table "public"."friendships" from "anon";

revoke insert on table "public"."friendships" from "anon";

revoke references on table "public"."friendships" from "anon";

revoke select on table "public"."friendships" from "anon";

revoke trigger on table "public"."friendships" from "anon";

revoke truncate on table "public"."friendships" from "anon";

revoke update on table "public"."friendships" from "anon";

revoke delete on table "public"."friendships" from "authenticated";

revoke insert on table "public"."friendships" from "authenticated";

revoke references on table "public"."friendships" from "authenticated";

revoke select on table "public"."friendships" from "authenticated";

revoke trigger on table "public"."friendships" from "authenticated";

revoke truncate on table "public"."friendships" from "authenticated";

revoke update on table "public"."friendships" from "authenticated";

revoke delete on table "public"."friendships" from "service_role";

revoke insert on table "public"."friendships" from "service_role";

revoke references on table "public"."friendships" from "service_role";

revoke select on table "public"."friendships" from "service_role";

revoke trigger on table "public"."friendships" from "service_role";

revoke truncate on table "public"."friendships" from "service_role";

revoke update on table "public"."friendships" from "service_role";

alter table "public"."friendships" drop constraint "friendships_creator_user_id_fkey";

alter table "public"."friendships" drop constraint "friendships_first_user_id_fkey";

alter table "public"."friendships" drop constraint "friendships_second_user_id_fkey";

alter table "public"."friendships" drop constraint "Friendships_pkey";

drop index if exists "public"."Friendships_pkey";

drop table "public"."friendships";

create table "public"."friendship" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "sender_id" uuid not null default auth.uid(),
    "receiver_id" uuid not null,
    "status" invitation_status not null default 'Pending'::invitation_status
);


alter table "public"."friendship" enable row level security;

CREATE UNIQUE INDEX friendship_pkey ON public.friendship USING btree (id);

alter table "public"."friendship" add constraint "friendship_pkey" PRIMARY KEY using index "friendship_pkey";

alter table "public"."friendship" add constraint "friendship_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friendship" validate constraint "friendship_receiver_id_fkey";

alter table "public"."friendship" add constraint "friendship_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friendship" validate constraint "friendship_sender_id_fkey";

grant delete on table "public"."friendship" to "anon";

grant insert on table "public"."friendship" to "anon";

grant references on table "public"."friendship" to "anon";

grant select on table "public"."friendship" to "anon";

grant trigger on table "public"."friendship" to "anon";

grant truncate on table "public"."friendship" to "anon";

grant update on table "public"."friendship" to "anon";

grant delete on table "public"."friendship" to "authenticated";

grant insert on table "public"."friendship" to "authenticated";

grant references on table "public"."friendship" to "authenticated";

grant select on table "public"."friendship" to "authenticated";

grant trigger on table "public"."friendship" to "authenticated";

grant truncate on table "public"."friendship" to "authenticated";

grant update on table "public"."friendship" to "authenticated";

grant delete on table "public"."friendship" to "service_role";

grant insert on table "public"."friendship" to "service_role";

grant references on table "public"."friendship" to "service_role";

grant select on table "public"."friendship" to "service_role";

grant trigger on table "public"."friendship" to "service_role";

grant truncate on table "public"."friendship" to "service_role";

grant update on table "public"."friendship" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."friendship"
as permissive
for select
to authenticated
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "Enable insert for authenticated users only"
on "public"."friendship"
as permissive
for insert
to authenticated
with check (((auth.uid() <> receiver_id) AND (receiver_id <> sender_id)));


create policy "Enable update for users based on their id"
on "public"."friendship"
as permissive
for update
to authenticated
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)))
with check (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


