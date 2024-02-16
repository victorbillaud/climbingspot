set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_spot_review_statistics(spot_id uuid)
 RETURNS TABLE(total_reviews integer, average_rating numeric, one_star_count integer, two_star_count integer, three_star_count integer, four_star_count integer, five_star_count integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH ratings AS (
        SELECT
            note,
            COUNT(note)::INT AS note_count
        FROM
            public.reviews
        WHERE
            reviews.spot_id = get_spot_review_statistics.spot_id
        GROUP BY
            note
    )
    SELECT
        (SELECT COUNT(*) FROM public.reviews WHERE reviews.spot_id = get_spot_review_statistics.spot_id)::INT AS total_reviews,
        COALESCE((SELECT AVG(note)::DECIMAL(10,2) FROM public.reviews WHERE reviews.spot_id = get_spot_review_statistics.spot_id), 0) AS average_rating,
        COALESCE((SELECT note_count FROM ratings WHERE note = 1), 0) AS one_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 2), 0) AS two_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 3), 0) AS three_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 4), 0) AS four_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 5), 0) AS five_star_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_review_statistics(creator_id uuid)
 RETURNS TABLE(total_reviews integer, average_rating numeric, one_star_count integer, two_star_count integer, three_star_count integer, four_star_count integer, five_star_count integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH ratings AS (
        SELECT
            note,
            COUNT(note)::INT AS note_count  -- Cast COUNT(note) to INT
        FROM
            public.reviews
        WHERE
            reviews.creator_id = get_user_review_statistics.creator_id
        GROUP BY
            note
    )
    SELECT
        (SELECT COUNT(*) FROM public.reviews WHERE reviews.creator_id = get_user_review_statistics.creator_id)::INT AS total_reviews, -- Cast COUNT(*) to INT
        COALESCE((SELECT AVG(note)::DECIMAL(10,2) FROM public.reviews WHERE reviews.creator_id = get_user_review_statistics.creator_id), 0) AS average_rating,
        COALESCE((SELECT note_count FROM ratings WHERE note = 1), 0) AS one_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 2), 0) AS two_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 3), 0) AS three_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 4), 0) AS four_star_count,
        COALESCE((SELECT note_count FROM ratings WHERE note = 5), 0) AS five_star_count;
END;
$function$
;

create or replace view "public"."reviews_with_like_count" as  SELECT r.id,
    r.created_at,
    r.updated_at,
    r.title,
    r.content,
    r.creator_id,
    r.spot_id,
    r.note,
    count(rl.id) AS like_count,
    bool_or((rl.profile_id = auth.uid())) AS request_user_liked
   FROM ((reviews r
     LEFT JOIN profiles p ON ((r.creator_id = p.id)))
     LEFT JOIN reviews_likes rl ON ((r.id = rl.review_id)))
  GROUP BY r.id, r.content, r.created_at, p.avatar_url, p.username;


create policy "Enable delete for users based on user_id"
on "public"."reviews"
as permissive
for delete
to authenticated
using ((auth.uid() = creator_id));


create policy "Enable update for users based on id"
on "public"."reviews"
as permissive
for update
to authenticated
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));


create policy "Enable delete for users based on user_id"
on "public"."reviews_likes"
as permissive
for delete
to authenticated
using ((auth.uid() = profile_id));



