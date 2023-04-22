import {
  CustomFormSetters,
  CustomFormValues,
  GetSpotResponseSuccess,
  ISpotExtended,
} from '@/features/spots';
import { useToggle } from '@/hooks';
import {
  Button,
  Flex,
  InputDate,
  InputText,
  InputTextArea,
  Text,
} from '../common';
import { SpotCardSmall, SpotSearchModal } from '../spot';
import { TEventInsert } from './types';

export type TEventFormProps = {
  form: CustomFormValues<TEventInsert>;
  setForm: CustomFormSetters<TEventInsert>;
  ssrSpots?: ISpotExtended[];
  initialSpot?: GetSpotResponseSuccess;
  spotSelected: GetSpotResponseSuccess | null;
  setSpotSelected: (spot: GetSpotResponseSuccess | null) => void;
};

export const EventForm = ({
  form,
  setForm,
  ssrSpots,
  initialSpot,
  spotSelected,
  setSpotSelected,
}: TEventFormProps) => {
  const [searchModalOpen, openSearchModal, closeSearchModal] = useToggle(false);
  return (
    <Flex
      fullSize
      direction="column"
      horizontalAlign="left"
      gap={0}
      className="divide-y overflow-y-auto divide-white-300 dark:divide-dark-300"
    >
      <Flex
        className="w-full p-3"
        direction="column"
        horizontalAlign="left"
        verticalAlign="top"
      >
        <Flex
          fullSize
          direction="row"
          horizontalAlign="stretch"
          verticalAlign="center"
        >
          <Text variant="body" color="text-brand-500" className="py-0 px-3">
            Event details
          </Text>
          <Flex direction="row" horizontalAlign="right" verticalAlign="center">
            <Button
              text="Reset spot"
              variant="primary"
              onClick={() => setSpotSelected(initialSpot || null)}
            />
            <Button
              text="Change spot"
              variant="default"
              icon="loop"
              onClick={() => openSearchModal()}
            />
          </Flex>
          {searchModalOpen && (
            <SpotSearchModal
              ssrSpots={ssrSpots}
              isOpen={searchModalOpen}
              onClose={() => closeSearchModal()}
              onConfirm={(spot) => {
                setSpotSelected(spot);
                closeSearchModal();
              }}
            />
          )}
        </Flex>
        {spotSelected ? (
          <SpotCardSmall spot={spotSelected} />
        ) : (
          <Flex className="w-full">
            <Text variant="body" className="py-0 px-3 opacity-80">
              You must select a spot
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex
        className="w-full p-3"
        direction="column"
        horizontalAlign="left"
        gap={6}
      >
        <InputText
          labelText="Event name"
          type="text"
          value={form.name}
          onChange={(e) => setForm.name(e.target.value)}
          className="w-full"
        />
        <InputText
          labelText="Number of participants"
          type="number"
          value={form.places}
          onChange={(e) =>
            setForm.places && setForm.places(Number(e.target.value))
          }
          className="w-full"
        />
        <InputDate
          labelText="Start date"
          type="datetime-local"
          value={form.start_at}
          onChange={(e) => setForm.start_at(e.target.value)}
          className="w-full"
        />
      </Flex>
      <Flex
        fullSize
        className="p-3"
        direction="column"
        horizontalAlign="left"
        verticalAlign="top"
        gap={6}
      >
        <Text variant="body" className="py-0 px-3" color="text-brand-500">
          Optional fields
        </Text>
        <InputTextArea
          labelText="Description"
          type="text"
          height={100}
          value={form.description}
          onChange={(e) =>
            setForm.description && setForm.description(e.target.value)
          }
          className="w-full"
        />
        <InputDate
          labelText="End date"
          type="datetime-local"
          value={form.end_at}
          onChange={(e) => setForm.end_at && setForm.end_at(e.target.value)}
          className="w-full"
        />
      </Flex>
    </Flex>
  );
};
