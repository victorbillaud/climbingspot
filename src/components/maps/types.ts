import { ISpotExtended } from '@/features/spots';

export interface ICluster {
  spots: ISpotExtended[];
  latitude: number;
  longitude: number;
}
export interface IMapProps {
  spots?: ISpotExtended[];
}
