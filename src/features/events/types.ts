import { TEventInsert, TEventUpdate } from '@/components/event';
import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  createEvent,
  getEvent,
  getSpotEvents,
  joinEvent,
  listEvents,
  listEventsFromCreator,
  updateEvent,
} from './service';

export type getEventParams = {
  client: SupabaseClient<Database>;
  eventId: string;
};

type EventResponse = Awaited<ReturnType<typeof getEvent>>;
export type EventResponseSuccess = EventResponse['event'];
export type EventResponseError = EventResponse['error'];

export type getSpotEventsParams = {
  client: SupabaseClient<Database>;
  spotId: string;
};

type SpotEventsResponse = Awaited<ReturnType<typeof getSpotEvents>>;
export type SpotEventsResponseSuccess = SpotEventsResponse['events'];
export type SpotEventsResponseError = SpotEventsResponse['error'];

export type joinEventParams = {
  client: SupabaseClient<Database>;
  eventId: string;
  userId: string;
};

type JoinEventResponse = Awaited<ReturnType<typeof joinEvent>>;
export type JoinEventResponseSuccess = JoinEventResponse['participation'];
export type JoinEventResponseError = JoinEventResponse['error'];

export type createEventParams = {
  client: SupabaseClient<Database>;
  event: TEventInsert;
};

type CreateEventResponse = Awaited<ReturnType<typeof createEvent>>;
export type CreateEventResponseSuccess = CreateEventResponse['event'];
export type CreateEventResponseError = CreateEventResponse['error'];

export type updateEventParams = {
  client: SupabaseClient<Database>;
  event: TEventUpdate;
};

type UpdateEventResponse = Awaited<ReturnType<typeof updateEvent>>;
export type UpdateEventResponseSuccess = UpdateEventResponse['event'];
export type UpdateEventResponseError = UpdateEventResponse['error'];

export type listEventsParams = {
  client: SupabaseClient<Database>;
  limit?: number;
  page?: number;
  ids?: string[];
};

type ListEventsResponse = Awaited<ReturnType<typeof listEvents>>;
export type ListEventsResponseSuccess = ListEventsResponse['events'];
export type ListEventsResponseError = ListEventsResponse['error'];

export type listEventsFromCreatorParams = {
  client: SupabaseClient<Database>;
  creatorId: string;
};

type ListEventsFromCreatorResponse = Awaited<
  ReturnType<typeof listEventsFromCreator>
>;
export type ListEventsFromCreatorResponseSuccess =
  ListEventsFromCreatorResponse['events'];
export type ListEventsFromCreatorResponseError =
  ListEventsFromCreatorResponse['error'];

export type listFriendsEventsParams = {
  client: SupabaseClient<Database>;
  userId: string;
};

type ListFriendsEventsResponse = Awaited<
  ReturnType<typeof listEventsFromCreator>
>;
export type ListFriendsEventsResponseSuccess =
  ListFriendsEventsResponse['events'];
export type ListFriendsEventsResponseError = ListFriendsEventsResponse['error'];

export type listUserEventsParams = {
  client: SupabaseClient<Database>;
  userId: string;
};

type ListUserEventsResponse = Awaited<ReturnType<typeof listEventsFromCreator>>;
export type ListUserEventsResponseSuccess = ListUserEventsResponse['events'];
export type ListUserEventsResponseError = ListUserEventsResponse['error'];
