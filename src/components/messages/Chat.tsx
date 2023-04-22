'use client';

import { useChat } from '@/features/messages';
import { getFirstItem } from '@/lib';
import React, { useEffect, useRef } from 'react';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button, Flex, Icon, InputText, Text } from '../common';
import { Message } from './Message';

export type TChatProps = {
  eventId: string;
};

export const Chat: React.FC<TChatProps> = ({ eventId }) => {
  const { supabase, user } = useSupabase();
  const [messages, sendMessage] = useChat({
    client: supabase,
    event_id: eventId,
  });

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!user || text === '') {
      return;
    }
    await sendMessage(text, user.id);
    setText('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const [text, setText] = React.useState('');

  return (
    <>
      <Flex
        fullSize
        horizontalAlign="left"
        className="divide-y divide-white-300 dark:divide-dark-300"
        gap={0}
      >
        <Flex
          className="hidden md:flex w-full rounded-t-md bg-gray-200 dark:bg-dark-300 px-4"
          direction="row"
          horizontalAlign="stretch"
          gap={1}
        >
          <Icon name="chat" />
          <Text variant="caption" className="p-3">
            Chat
          </Text>
        </Flex>
        {messages.length > 0 ? (
          <div className="flex flex-col relative w-full h-full overflow-y-auto">
            <div className="absolute bottom-0 w-full h-full p-3">
              {messages.map((message, index) => (
                <Message
                  key={message.id}
                  content={message.content}
                  created_at={message.created_at as string}
                  user={getFirstItem(message.user)}
                  showUser={messages[index + 1]?.user_id !== message.user_id}
                  isOwnMessage={message.user_id === user?.id}
                />
              ))}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
        ) : (
          <Flex fullSize>
            <Icon name="spin" className="animate-spin" />
          </Flex>
        )}

        <form className="w-full" onSubmit={handleSendMessage}>
          <Flex
            className="w-full p-2"
            direction="row"
            horizontalAlign="right"
            verticalAlign="center"
            gap={1}
          >
            <InputText
              className="w-full"
              placeholder="Hi there!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              text="Send message"
              icon="send"
              iconOnly
              onClick={handleSendMessage}
              variant={'default'}
            />
            <input type="submit" value="Submit" hidden />
          </Flex>
        </form>
      </Flex>
    </>
  );
};
