import { logger } from '@/lib/logger';
import { getFriends } from '../friendship';
import {
  createEventParams,
  getEventParams,
  getSpotEventsParams,
  joinEventParams,
  listEventsFromCreatorParams,
  listEventsParams,
  listFriendsEventsParams,
  listUserEventsParams,
  updateEventParams,
} from './types';
// TODO: CHANGE FULL_NAME TO USERNAME

export const getEvent = async ({ eventId, client }: getEventParams) => {
  const { data: event, error } = await client
    .from('events')
    .select(
      `
        *,
        creator:profiles(avatar_url, full_name, username),
        participations:events_participations(*, user:profiles(avatar_url, full_name, username)),
        spot:spots(*)
      `,
    )
    .eq('id', eventId)
    .single();

  if (error) {
    logger.error(error);
  }

  return { event, error };
};

export const createEvent = async ({ client, event }: createEventParams) => {
  const { data: createdEvent, error } = await client
    .from('events')
    .insert(event)
    .select(
      `
        *,
        creator:profiles(avatar_url, full_name, username),
        participations:events_participations(*, user:profiles(avatar_url, full_name, username))
      `,
    )
    .single();

  if (error) {
    logger.error(error);
  }

  return { event: createdEvent, error };
};

export const updateEvent = async ({ client, event }: updateEventParams) => {
  const { data: updatedEvent, error } = await client
    .from('events')
    .update({
      name: event.name,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      places: event.places,
      spot_id: event.spot_id,
    })
    .eq('id', event.id)
    .select(
      `
        *,
        creator:profiles(avatar_url, full_name, username),
        participations:events_participations(*, user:profiles(avatar_url, full_name, username))
      `,
    )
    .single();

  if (error) {
    logger.error(error);
  }

  return { event: updatedEvent, error };
};

export const getSpotEvents = async ({
  spotId,
  client,
}: getSpotEventsParams) => {
  const { data: events, error } = await client
    .from('events')
    .select(
      `
        *,
        creator:profiles(avatar_url, full_name, username),
        participations:events_participations(*, user:profiles(avatar_url, full_name, username))
      `,
    )
    .limit(10)
    .order('start_at', { ascending: true })
    .eq('spot_id', spotId);

  if (error) {
    logger.error(error);
  }

  return { events, error };
};

export const joinEvent = async ({
  eventId,
  userId,
  client,
}: joinEventParams) => {
  const { data: participation, error } = await client
    .from('events_participations')
    .insert({ event_id: eventId, user_id: userId })
    .select(
      `
        *,
        user:profiles(avatar_url, full_name, username)
      `,
    )
    .single();

  if (error) {
    logger.error(error);
  }

  return { participation, error };
};

export const leaveEvent = async ({
  eventId,
  userId,
  client,
}: joinEventParams) => {
  const { error, status } = await client
    .from('events_participations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) {
    logger.error(error);
  }

  return { status, error };
};

export const listEvents = async ({
  client,
  limit = 20,
  page = 1,
  ids,
}: listEventsParams) => {
  const query = client
    .from('events')
    .select(
      `
        *,
        creator:profiles(avatar_url, full_name, username),
        participations:events_participations(*, user:profiles(avatar_url, full_name, username)),
        spot:spots(*)
      `,
      { count: 'exact' },
    )
    .limit(limit)
    .order('start_at', { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (ids) {
    query.filter('id', 'in', `(${ids.join(',')})`);
  }

  const { data: events, count, error } = await query;

  if (error) {
    logger.error(error);
  }

  return { events, count, error };
};

export const listEventsFromCreator = async ({
  client,
  creatorId,
}: listEventsFromCreatorParams) => {
  const { data: events, error } = await client
    .from('events')
    .select(
      `
        id,
        name,
        description,
        start_at,
        end_at,
        places,
        participations:events_participations(*, user:profiles(avatar_url, full_name, username)),
        spot_id,
        creator_id
      `,
    )
    .order('start_at', { ascending: true })
    .eq('creator_id', creatorId);

  if (error) {
    logger.error(error);
  }

  return { events, error };
};

export const listFriendsEvents = async ({
  client,
  userId,
}: listFriendsEventsParams) => {
  const { friendships } = await getFriends({ client, userId });

  if (!friendships) {
    return { events: [], error: null };
  }

  const friends = friendships?.map((friendship) =>
    friendship.second_user_id == userId
      ? friendship.first_user_id
      : friendship.second_user_id,
  );

  const { data: events, error } = await client
    .from('events')
    .select(
      `
        *,
        events_participations!inner(*, user:profiles(avatar_url, full_name, username))
      `,
    )
    .limit(10)
    .order('start_at', { ascending: true })
    .filter('events_participations.user_id', 'in', `(${friends.join(',')})`)
    .filter('creator_id', 'neq', userId);

  if (error) {
    logger.error(error);
    return { events: [], error };
  }

  const {
    events: eventsToSend,
    error: error2,
    count,
  } = await listEvents({ client: client, ids: events?.map((e) => e.id) });

  if (error2) {
    logger.error('listFriendEvents', error2);
  }

  return {
    events: eventsToSend,
    count,
    error,
  };
};

export const listUserEvents = async ({
  client,
  userId,
}: listUserEventsParams) => {
  const { data: events, error } = await client
    .from('events')
    .select(
      `
        *,
        events_participations!inner(*, user:profiles(avatar_url, full_name, username))
      `,
    )
    .limit(10)
    .order('start_at', { ascending: true })
    .filter('events_participations.user_id', 'eq', userId);

  if (error) {
    logger.error(error);
    return { events: [], error };
  }

  const {
    events: eventsToSend,
    error: error2,
    count,
  } = await listEvents({ client: client, ids: events?.map((e) => e.id) });

  if (error2) {
    logger.error('listUserEvents', error2);
  }

  logger.info(eventsToSend);

  return {
    events: eventsToSend,
    count,
    error,
  };
};
