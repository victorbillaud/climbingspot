import { EventResponseSuccess } from '@/features/events';
import { GetSpotResponseSuccess, ISpotExtended } from '@/features/spots';
import { Database } from '@/lib/db_types';

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];

export type EventParticipation =
  Database['public']['Tables']['events_participations']['Row'];
export type EventParticipationInsert =
  Database['public']['Tables']['events_participations']['Insert'];

export type EventInvitation =
  Database['public']['Tables']['events_invitations']['Row'];
export type EventInvitationInsert =
  Database['public']['Tables']['events_invitations']['Insert'];

export type TEventCreateModalProps = {
  showButton?: boolean;
  initialPanelState?: boolean;
  initialEvent?: TEventInsert;
  spot?: GetSpotResponseSuccess;
  ssrSpots?: ISpotExtended[];
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  onConfirm?: (event: Event) => void;
};

export type TEventUpdateModalProps = {
  showButton?: boolean;
  initialPanelState?: boolean;
  initialEvent: EventResponseSuccess;
  spot: GetSpotResponseSuccess;
  ssrSpots?: ISpotExtended[];
  onClose?: () => void;
  onConfirm?: (event: Event) => void;
};

export type TEventInsert = Database['public']['Tables']['events']['Insert'];
export type TEventUpdate = Database['public']['Tables']['events']['Update'];
