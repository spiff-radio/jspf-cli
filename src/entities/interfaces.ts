import { Validator, ValidatorResult } from 'jsonschema';

export interface JspfAttributionI {
  [key: string]: string;
}

export interface JspfLinkI {
  [key: string]: string;
}

export interface JspfMetaI {
  [key: string]: string;
}

export interface JspfExtensionI {
  [key: string]: any[];
}

export interface JspfTrackI {
  location?: string[];
  identifier?: string[];
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  image?: string;
  album?: string;
  trackNum?: number;
  duration?: number;
  link?: JspfLinkI[];
  meta?: JspfMetaI[];
  extension?: JspfExtensionI;
}

export interface JspfPlaylistI {
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
}

export interface JspfI {
  playlist?:Record<string, any>
}
