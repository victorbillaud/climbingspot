create table "public"."messages" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "event_id" uuid not null,
    "content" text not null
);


alter table "public"."messages" enable row level security;

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."messages" add constraint "messages_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_event_id_fkey";

alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."messages"
as permissive
for insert
to authenticated
with check (true);


create policy "Select"
on "public"."messages"
as permissive
for select
to authenticated
using (true);



