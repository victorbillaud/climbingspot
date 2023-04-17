import { TEventInsert, TEventUpdate } from '@/components/event';
import { createClient } from '@/lib/supabase/server';
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
  client: ReturnType<typeof createClient>;
  eventId: string;
};

type EventResponse = Awaited<ReturnType<typeof getEvent>>;
export type EventResponseSuccess = EventResponse['event'];
export type EventResponseError = EventResponse['error'];

export type getSpotEventsParams = {
  client: ReturnType<typeof createClient>;
  spotId: string;
};

type EventsResponse = Awaited<ReturnType<typeof getSpotEvents>>;
export type EventsResponseSuccess = EventsResponse['events'];
export type EventsResponseError = EventsResponse['error'];

export type joinEventParams = {
  client: ReturnType<typeof createClient>;
  eventId: string;
  userId: string;
};

type JoinEventResponse = Awaited<ReturnType<typeof joinEvent>>;
export type JoinEventResponseSuccess = JoinEventResponse['participation'];
export type JoinEventResponseError = JoinEventResponse['error'];

export type createEventParams = {
  client: ReturnType<typeof createClient>;
  event: TEventInsert;
};

type CreateEventResponse = Awaited<ReturnType<typeof createEvent>>;
export type CreateEventResponseSuccess = CreateEventResponse['event'];
export type CreateEventResponseError = CreateEventResponse['error'];

export type updateEventParams = {
  client: ReturnType<typeof createClient>;
  event: TEventUpdate;
};

type UpdateEventResponse = Awaited<ReturnType<typeof updateEvent>>;
export type UpdateEventResponseSuccess = UpdateEventResponse['event'];
export type UpdateEventResponseError = UpdateEventResponse['error'];

export type listEventsParams = {
  client: ReturnType<typeof createClient>;
  limit?: number;
  page?: number;
};

type ListEventsResponse = Awaited<ReturnType<typeof listEvents>>;
export type ListEventsResponseSuccess = ListEventsResponse['events'];
export type ListEventsResponseError = ListEventsResponse['error'];

export type listEventsFromCreatorParams = {
  client: ReturnType<typeof createClient>;
  creatorId: string;
};

type ListEventsFromCreatorResponse = Awaited<
  ReturnType<typeof listEventsFromCreator>
>;
export type ListEventsFromCreatorResponseSuccess =
  ListEventsFromCreatorResponse['events'];
export type ListEventsFromCreatorResponseError =
  ListEventsFromCreatorResponse['error'];
