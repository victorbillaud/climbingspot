create table "public"."notification" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "title" text not null,
    "body" text not null,
    "data" json,
    "subtitle" text
);


alter table "public"."notification" enable row level security;

CREATE UNIQUE INDEX notification_pkey ON public.notification USING btree (id);

alter table "public"."notification" add constraint "notification_pkey" PRIMARY KEY using index "notification_pkey";

alter table "public"."notification" add constraint "notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notification_user_id_fkey";

grant delete on table "public"."notification" to "anon";

grant insert on table "public"."notification" to "anon";

grant references on table "public"."notification" to "anon";

grant select on table "public"."notification" to "anon";

grant trigger on table "public"."notification" to "anon";

grant truncate on table "public"."notification" to "anon";

grant update on table "public"."notification" to "anon";

grant delete on table "public"."notification" to "authenticated";

grant insert on table "public"."notification" to "authenticated";

grant references on table "public"."notification" to "authenticated";

grant select on table "public"."notification" to "authenticated";

grant trigger on table "public"."notification" to "authenticated";

grant truncate on table "public"."notification" to "authenticated";

grant update on table "public"."notification" to "authenticated";

grant delete on table "public"."notification" to "service_role";

grant insert on table "public"."notification" to "service_role";

grant references on table "public"."notification" to "service_role";

grant select on table "public"."notification" to "service_role";

grant trigger on table "public"."notification" to "service_role";

grant truncate on table "public"."notification" to "service_role";

grant update on table "public"."notification" to "service_role";

create policy "Enable all access for service_role"
on "public"."notification"
as permissive
for all
to service_role
using (true)
with check (true);


CREATE TRIGGER event_participation_webhook AFTER INSERT OR DELETE OR UPDATE ON public.events_participations FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/event-participation-trigger', 'POST', '{"Content-type":"application/json"}', '{}', '1000');

CREATE TRIGGER message_insert_webhook AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/message-trigger', 'POST', '{"Content-type":"application/json"}', '{}', '1000');

CREATE TRIGGER notification_insert_webhook AFTER INSERT ON public.notification FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/notify', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


