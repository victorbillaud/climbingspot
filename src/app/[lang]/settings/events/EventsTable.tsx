import { Flex, Table } from '@/components/common';
import { ListEventsFromCreatorResponseSuccess } from '@/features/events';

export type TEventsTableProps = {
  events: NonNullable<ListEventsFromCreatorResponseSuccess>;
};

export const EventsTable = ({ events }: TEventsTableProps) => {
  return (
    <Flex
      fullSize={true}
      verticalAlign="center"
      horizontalAlign="center"
      className="p-3 pt-0"
    >
      <Table rows={events} />
    </Flex>
  );
};
