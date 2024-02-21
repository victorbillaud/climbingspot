set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_related_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    file_path TEXT;
    file_name TEXT;
BEGIN
    -- Check if avatar_url is not null and not empty
    IF OLD.avatar_url IS NOT NULL AND OLD.avatar_url <> '' THEN
        -- Extract the file path from the avatar_url
        file_path = split_part(OLD.avatar_url, '/avatars/', 2);
        
        -- Assuming the file_path includes further directories and the file name,
        -- and you need to delete based on the full path under the avatars bucket
        file_name = split_part(file_path, '/', 2); -- Adjust if the structure differs
        
        -- Delete the corresponding record from the storage.objects table
        DELETE FROM storage.objects
        WHERE bucket_id = 'avatars' AND name LIKE '%' || file_name;
    END IF;
    
    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_related_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    image_url TEXT;
    file_name TEXT;
BEGIN
    -- Loop through each URL in the spots.image array
    FOREACH image_url IN ARRAY OLD.image
    LOOP
        -- Extract the file name from the URL
        file_name = split_part(image_url, '/images/', 2);
        
        -- Delete the corresponding record from the storage.objects table
        DELETE FROM storage.objects
        WHERE bucket_id = 'images' AND name = file_name;
    END LOOP;
    
    RETURN OLD;
END;
$function$
;

CREATE TRIGGER trigger_delete_related_avatar BEFORE DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION delete_related_avatar();

CREATE TRIGGER trigger_delete_related_images BEFORE DELETE ON public.spots FOR EACH ROW EXECUTE FUNCTION delete_related_images();


