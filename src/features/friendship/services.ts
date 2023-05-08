import { addFriendProps, checkFriendshipProps, getFriendsProps } from './types';

export async function addFriend({ client, friendship }: addFriendProps) {
  const { data, error } = await client
    .from('friendships')
    .insert(friendship)
    .select(
      `
            *,
            first_user:friendships_first_user_id_fkey(avatar_url, full_name, username),
            second_user:friendships_second_user_id_fkey(avatar_url, full_name, username)
        `,
    )
    .single();

  if (error) {
    console.error(error);
  }

  return { friendship: data, error };
}

export async function getFriends({ client, userId, status }: getFriendsProps) {
  const { data: friendships, error } = await client
    .from('friendships')
    .select(
      `
        *,
        first_user:friendships_first_user_id_fkey(avatar_url, full_name, username),
        second_user:friendships_second_user_id_fkey(avatar_url, full_name, username)
    `,
    )
    .or(`second_user_id.eq.${userId},first_user_id.eq.${userId}`)
    .filter('status', 'eq', status);

  if (error) {
    console.error(error);
  }

  return { friendships, error };
}

export async function checkFriendship({
  client,
  firstUserId,
  secondUserId,
}: checkFriendshipProps) {
  const { data: friendship, error } = await client
    .from('friendships')
    .select(
      `
            *,
            first_user:friendships_first_user_id_fkey(avatar_url, full_name, username),
            second_user:friendships_second_user_id_fkey(avatar_url, full_name, username)
        `,
    )
    .or(
      `and(second_user_id.eq.${firstUserId},first_user_id.eq.${secondUserId}),and(second_user_id.eq.${secondUserId},first_user_id.eq.${firstUserId})`,
    );

  if (error) {
    console.error(error);
  }

  return { friendship, error };
}
