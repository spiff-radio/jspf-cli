import { Type } from 'class-transformer';
import {JspfAttributionI,JspfLinkI,JspfMetaI,JspfExtensionI,JspfPlaylistI,JspfTrackI} from '../entities/jspf/interfaces';
import {Track} from './models';

export interface PlaylistI extends JspfPlaylistI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: JspfAttributionI[];
  link?: JspfLinkI[];
  meta?: JspfMetaI[];
  extension?: JspfExtensionI;
  track?: JspfTrackI[];
  tracks():Track[];
}
