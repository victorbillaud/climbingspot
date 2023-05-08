alter table "public"."events_invitations" alter column "status" drop default;

alter table "public"."events_participations" alter column "status" drop default;

alter type "public"."invitation_status" rename to "invitation_status__old_version_to_be_dropped";

create type "public"."invitation_status" as enum ('Pending', 'Accepted', 'Declined');

create table "public"."friendships" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "first_user_id" uuid not null,
    "second_user_id" uuid not null,
    "creator_user_id" uuid not null,
    "status" invitation_status not null default 'Pending'::invitation_status
);


alter table "public"."friendships" enable row level security;

alter table "public"."events_invitations" alter column status type "public"."invitation_status" using status::text::"public"."invitation_status";

alter table "public"."events_participations" alter column status type "public"."invitation_status" using status::text::"public"."invitation_status";

alter table "public"."events_invitations" alter column "status" set default 'Pending'::invitation_status;

alter table "public"."events_participations" alter column "status" set default 'Pending'::invitation_status;

drop type "public"."invitation_status__old_version_to_be_dropped";

CREATE UNIQUE INDEX "Friendships_pkey" ON public.friendships USING btree (id);

alter table "public"."friendships" add constraint "Friendships_pkey" PRIMARY KEY using index "Friendships_pkey";

alter table "public"."friendships" add constraint "friendships_creator_user_id_fkey" FOREIGN KEY (creator_user_id) REFERENCES profiles(id) not valid;

alter table "public"."friendships" validate constraint "friendships_creator_user_id_fkey";

alter table "public"."friendships" add constraint "friendships_first_user_id_fkey" FOREIGN KEY (first_user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friendships" validate constraint "friendships_first_user_id_fkey";

alter table "public"."friendships" add constraint "friendships_second_user_id_fkey" FOREIGN KEY (second_user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friendships" validate constraint "friendships_second_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."friendships"
as permissive
for select
to authenticated
using (((auth.uid() = first_user_id) OR (auth.uid() = second_user_id)));


create policy "Enable insert for authenticated users only"
on "public"."friendships"
as permissive
for insert
to authenticated
with check (((auth.uid() <> second_user_id) AND (second_user_id <> first_user_id)));


create policy "Enable update for users based on email"
on "public"."friendships"
as permissive
for update
to authenticated
using (((auth.uid() = first_user_id) OR (auth.uid() = second_user_id)))
with check (((auth.uid() = first_user_id) OR (auth.uid() = second_user_id)));



