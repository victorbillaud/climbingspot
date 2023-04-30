import { ISpotExtended } from '@/features/spots';
import { SpotCardSmall } from '../spot';
import { LazyPopup } from './Lazy';
import './popup.css';

export type TPopupProps = {
  spot: ISpotExtended;
};

export const Popup = ({ spot }: TPopupProps) => {
  return (
    <LazyPopup offset={[0, -10]} className="bg-white-100 dark:bg-dark-100">
      <SpotCardSmall spot={spot} orientation="vertical" openFloatingPanel />
    </LazyPopup>
  );
};
