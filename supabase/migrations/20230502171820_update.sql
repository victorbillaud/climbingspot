create policy "Update"
on "public"."spots"
as permissive
for update
to authenticated
using ((auth.uid() = creator))
with check ((auth.uid() = creator));



