import { Button } from '@/components/common';
import { EventResponseSuccess } from '@/features/events';
import { copyToClipboard } from '@/lib';
import { toast } from 'react-toastify';

export type TShareButtonProps = {
  event: NonNullable<EventResponseSuccess>;
};

export const ShareButton = ({ event }: TShareButtonProps) => {
  return (
    <Button
      text="Share"
      icon="link"
      variant="primary"
      className="w-full"
      onClick={() => {
        copyToClipboard(
          `${window.location.origin}/event/${event.id}`,
          () => {
            toast.success('Link copied to clipboard');
          },
          () => {
            toast.error('Failed to copy to clipboard');
          },
        );
      }}
    />
  );
};
