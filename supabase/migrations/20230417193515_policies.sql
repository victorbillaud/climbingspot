CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

create policy "Enable update for users based on id"
on "public"."events"
as permissive
for update
to authenticated
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));

drop policy if exists "Insert 1ffg0oo_0" on "storage"."objects";
create policy "Insert 1ffg0oo_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'images'::text));


drop policy if exists "Insert 1ffg0oo_1" on "storage"."objects";
create policy "Insert 1ffg0oo_1"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'images'::text));

drop policy if exists "Insert 1ffg0oo_2" on "storage"."objects";
create policy "Insert 1ffg0oo_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'images'::text));

drop policy if exists "Select 1ffg0oo_0" on "storage"."objects";
create policy "Select 1ffg0oo_0"
on "storage"."objects"
as permissive
for select
to anon
using ((bucket_id = 'images'::text));



