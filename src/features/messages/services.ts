import {
  TGetMessageParams,
  TGetMessageReturn,
  TListEventMessagesParams,
  TUseChatParams,
} from '@/features/messages/types';
import { useEffect, useState } from 'react';

export const listEventMessages = async (params: TListEventMessagesParams) => {
  const { client, event_id } = params;
  return await client
    .from('messages')
    .select(`*, user:profiles (id, username, avatar_url)`)
    .eq('event_id', event_id)
    .order('created_at', { ascending: true });
};

export const getMessage = async (params: TGetMessageParams) => {
  const { client, message_id } = params;
  const { data, error } = await client
    .from('messages')
    .select(`*, user:profiles (id, username, avatar_url)`)
    .eq('id', message_id)
    .single();

  return { data, error };
};

export function useChat({ client, event_id }: TUseChatParams): [
  NonNullable<TGetMessageReturn>[],
  // eslint-disable-next-line no-unused-vars
  (content: string, user_id: string) => Promise<void>,
  boolean, // Adding messagesLoaded attribute
] {
  const [messages, setMessages] = useState<NonNullable<TGetMessageReturn[]>>(
    [],
  );
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false); // Add messagesLoaded state

  const sendMessage = async (content: string, user_id: string) => {
    const { data, error } = await client.from('messages').insert([
      {
        content: content,
        user_id: user_id,
        event_id: event_id,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      console.log('Message sent:', data);
    }
  };

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await listEventMessages({
        client: client,
        event_id: event_id,
      });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
        setMessagesLoaded(true); // Update messagesLoaded state to true
      }
    };

    // Set up real-time message subscription
    const messagesChannel = client
      .channel(`messages:*`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          table: 'messages',
          filter: `event_id=eq.${event_id}`,
        },
        async (payload) => {
          const message_id = payload.new.id;
          const { data, error } = await getMessage({
            client: client,
            message_id: message_id,
          });

          if (error) {
            console.error('Error fetching message:', error);
          } else {
            setMessages((messages) => [...messages, data]);
          }
        },
      )
      .subscribe();

    fetchMessages();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [event_id]);

  return [messages, sendMessage, messagesLoaded]; // Include messagesLoaded in the return array
}
