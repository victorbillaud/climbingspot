import { useToggle } from '@/hooks';
import React from 'react';
import { Button, Card, Flex, FloatingPanel } from '../common';
import { Chat } from './Chat';

export type TChatContainerProps = {
  eventId: string;
};

export const ChatContainer: React.FC<TChatContainerProps> = ({ eventId }) => {
  const [floatingPanelOpen, openFloatingPanel, closeFloatingPanel] =
    useToggle(false);

  return (
    <>
      <Flex className="hidden md:flex h-full w-1/3 min-w-[35%] p-3 pl-0">
        <Card className="h-full w-full">
          <Chat eventId={eventId} />
        </Card>
      </Flex>
      <Flex className="md:hidden absolute top-3 right-0 p-3">
        <Button
          onClick={openFloatingPanel}
          variant="default"
          text="Chat"
          icon="chat"
        />
      </Flex>
      <FloatingPanel
        isOpen={floatingPanelOpen}
        onClose={closeFloatingPanel}
        size="large"
        title={'Chat'}
        onConfirm={closeFloatingPanel}
        customFooter={<></>}
        customHeader={
          <Flex direction="row" horizontalAlign="stretch" gap={1}>
            <Button
              onClick={closeFloatingPanel}
              variant="none"
              text="Close"
              icon="chevron-left"
            />
          </Flex>
        }
      >
        <Chat eventId={eventId} />
      </FloatingPanel>
    </>
  );
};
