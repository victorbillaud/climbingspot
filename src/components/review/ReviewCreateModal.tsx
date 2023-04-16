import { Button, InputText, InputTextArea, Modal } from '@/components/common';
import { useToggle } from '@/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import NumberSelector from '../common/input/NumberSelector';
import { TReviewCreateModalProps, TReviewInsert } from './types';

export const ReviewCreateModal = ({
  spotId,
  onClose,
  onConfirm,
}: TReviewCreateModalProps) => {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [creatingModalOpen, openCreatingModal, closeCreatingModal] =
    useToggle(false);

  const [note, setNote] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleCreateReview = async (review: TReviewInsert) => {
    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert(review)
      .select('*, creator:profiles(avatar_url)')
      .single();

    if (error) {
      toast.error("Couldn't create review");
      logger.error(error);
      return;
    }

    if (newReview) {
      toast.success('Review created');
      return newReview;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a review');
      return;
    }

    if (title === '') {
      toast.error('Title must not be empty');
      return;
    }

    if (content === '') {
      toast.error('Content must not be empty');
      return;
    }

    const reviewCreated = await handleCreateReview({
      spot_id: spotId,
      creator_id: user.id,
      note,
      title,
      content,
    });

    if (reviewCreated) {
      toast.success('Review created');
      router.refresh();
      onConfirm && onConfirm(reviewCreated);
    }
  };

  return (
    <>
      <Button
        text="Add a review"
        variant="default"
        onClick={() => openCreatingModal()}
      />
      <Modal
        isOpen={creatingModalOpen}
        title="Add a review"
        onClose={() => {
          closeCreatingModal();
          onClose && onClose();
        }}
        size="medium"
        onConfirm={async () => {
          await handleSubmit();
          closeCreatingModal();
        }}
      >
        <div className="flex flex-col p-3 gap-2">
          <NumberSelector
            maxNumber={5}
            value={note}
            setValue={(value) => {
              setNote(value);
            }}
          />
          <InputText
            labelText="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputTextArea
            labelText="Content"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};
