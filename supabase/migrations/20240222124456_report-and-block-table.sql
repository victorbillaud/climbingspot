create type "public"."report_source" as enum ('PROFILE', 'SPOT', 'REVIEW', 'EVENT');

create type "public"."report_type" as enum ('Nudity or Sexual Content', 'Violence or Dangerous Behavior', 'Hate Speech or Discrimination', 'Harassment or Bullying', 'False Information or Misleading Content', 'Spam or Malware', 'Intellectual Property Violation', 'Illegal Activities or Content', 'Privacy Violation', 'Offensive Language or Behavior', 'Child Safety', 'Impersonation', 'Other');

create table "public"."blocks" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "blocked_id" uuid not null,
    "blocker_id" uuid not null default auth.uid()
);


alter table "public"."blocks" enable row level security;

create table "public"."report" (
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default auth.uid(),
    "source" report_source not null,
    "sender" uuid not null default auth.uid(),
    "type" report_type not null,
    "content" text
);


alter table "public"."report" enable row level security;

alter table "public"."profiles" add column "created_at" timestamp with time zone not null default now();

alter table "public"."profiles" alter column "updated_at" set default now();

CREATE UNIQUE INDEX blocks_pkey ON public.blocks USING btree (id);

CREATE UNIQUE INDEX report_pkey ON public.report USING btree (id);

alter table "public"."blocks" add constraint "blocks_pkey" PRIMARY KEY using index "blocks_pkey";

alter table "public"."report" add constraint "report_pkey" PRIMARY KEY using index "report_pkey";

alter table "public"."blocks" add constraint "blocks_blocked_id_fkey" FOREIGN KEY (blocked_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."blocks" validate constraint "blocks_blocked_id_fkey";

alter table "public"."blocks" add constraint "blocks_blocker_id_fkey" FOREIGN KEY (blocker_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."blocks" validate constraint "blocks_blocker_id_fkey";

alter table "public"."report" add constraint "report_sender_fkey" FOREIGN KEY (sender) REFERENCES profiles(id) not valid;

alter table "public"."report" validate constraint "report_sender_fkey";

alter table "public"."reviews" add constraint "reviews_note_check" CHECK (((note >= 0) AND (note <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_note_check";

grant delete on table "public"."blocks" to "anon";

grant insert on table "public"."blocks" to "anon";

grant references on table "public"."blocks" to "anon";

grant select on table "public"."blocks" to "anon";

grant trigger on table "public"."blocks" to "anon";

grant truncate on table "public"."blocks" to "anon";

grant update on table "public"."blocks" to "anon";

grant delete on table "public"."blocks" to "authenticated";

grant insert on table "public"."blocks" to "authenticated";

grant references on table "public"."blocks" to "authenticated";

grant select on table "public"."blocks" to "authenticated";

grant trigger on table "public"."blocks" to "authenticated";

grant truncate on table "public"."blocks" to "authenticated";

grant update on table "public"."blocks" to "authenticated";

grant delete on table "public"."blocks" to "service_role";

grant insert on table "public"."blocks" to "service_role";

grant references on table "public"."blocks" to "service_role";

grant select on table "public"."blocks" to "service_role";

grant trigger on table "public"."blocks" to "service_role";

grant truncate on table "public"."blocks" to "service_role";

grant update on table "public"."blocks" to "service_role";

grant delete on table "public"."report" to "anon";

grant insert on table "public"."report" to "anon";

grant references on table "public"."report" to "anon";

grant select on table "public"."report" to "anon";

grant trigger on table "public"."report" to "anon";

grant truncate on table "public"."report" to "anon";

grant update on table "public"."report" to "anon";

grant delete on table "public"."report" to "authenticated";

grant insert on table "public"."report" to "authenticated";

grant references on table "public"."report" to "authenticated";

grant select on table "public"."report" to "authenticated";

grant trigger on table "public"."report" to "authenticated";

grant truncate on table "public"."report" to "authenticated";

grant update on table "public"."report" to "authenticated";

grant delete on table "public"."report" to "service_role";

grant insert on table "public"."report" to "service_role";

grant references on table "public"."report" to "service_role";

grant select on table "public"."report" to "service_role";

grant trigger on table "public"."report" to "service_role";

grant truncate on table "public"."report" to "service_role";

grant update on table "public"."report" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."blocks"
as permissive
for insert
to authenticated
with check (true);


create policy "Select"
on "public"."blocks"
as permissive
for select
to authenticated
using ((blocker_id = auth.uid()));


create policy "Enable insert for authenticated users only"
on "public"."report"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated sender of the report"
on "public"."report"
as permissive
for select
to authenticated
using ((sender = auth.uid()));




