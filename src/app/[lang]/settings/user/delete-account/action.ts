'use server';

import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function deleteAccount(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const deleteSpots: boolean = formData.get('deleteSpots') === 'true';

  const { error } = await supabase.rpc('delete_user_account', {
    delete_spots: deleteSpots,
  });

  if (error) {
    throw new Error(error.message);
  }

  supabase.auth.signOut();
  redirect('/auth/login');
}
