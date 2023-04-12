import { Type } from 'class-transformer';
import {AttributionDataI,LinkDataI,MetaDataI,ExtensionDataI,PlaylistDataI,TrackDataI} from '../entities/jspf/interfaces';
import {Track} from './models';

export interface PlaylistI extends PlaylistDataI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: AttributionDataI[];
  link?: LinkDataI[];
  meta?: MetaDataI[];
  extension?: ExtensionDataI;
  track?: TrackDataI[];
  tracks():Track[];
}
