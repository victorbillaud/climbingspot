import {
  addFriendProps,
  answerFriendRequestProps,
  checkFriendshipProps,
  getFriendsProps
} from './types';

export async function addFriend({ client, friendship }: addFriendProps) {
  const { data, error } = await client
    .from('friendship')
    .insert(friendship)
    .select(
      `
            *,
            sender:profiles!sender_id(id, avatar_url, full_name, username),
            receiver:profiles!receiver_id(id, avatar_url, full_name, username)
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
    .from('friendship')
    .select(
      `
      *,
      sender:profiles!sender_id(id, avatar_url, full_name, username),
      receiver:profiles!receiver_id(id, avatar_url, full_name, username)
    `,
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .filter('status', 'in', status ? `(${status})` : '(Accepted,Pending)');

  if (error) {
    console.error(error);
  }

  return { friendships, error };
}

export async function checkFriendship({
  client,
  connectedUserId,
  requestedUserId,
}: checkFriendshipProps) {
  const { data: friendship, error } = await client
    .from('friendship')
    .select(
      `
      *,
      sender:profiles!sender_id(id, avatar_url, full_name, username),
      receiver:profiles!receiver_id(id, avatar_url, full_name, username)
      `,
    )
    .or(
      `and(sender_id.eq.${connectedUserId},receiver_id.eq.${requestedUserId}),and(sender_id.eq.${requestedUserId},receiver_id.eq.${connectedUserId})`,
    )
    .neq('status', 'Declined')
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  return { friendship, error };
}

export async function answerFriendRequest({
  client,
  friendshipId,
  status,
}: answerFriendRequestProps) {
  const { data, error } = await client
    .from('friendship')
    .update({ status })
    .eq('id', friendshipId)
    .select(
      `
      *,
      sender:profiles!sender_id(id, avatar_url, full_name, username),
      receiver:profiles!receiver_id(id, avatar_url, full_name, username)
      `,
    )
    .single();

  if (error) {
    console.error(error);
  }

  return { friendship: data, error };
}
