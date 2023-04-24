import {Validator, ValidatorResult} from 'jsonschema';

export interface AttributionI {
  [key: string]: string;
}

export interface LinkI {
  [key: string]: string;
}

export interface MetaI {
  [key: string]: string;
}

export interface ExtensionI {
  [key: string]: any[];
}

export interface TrackI {
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
  link?: LinkI[];
  meta?: MetaI[];
  extension?: ExtensionI;
}

export interface PlaylistI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: AttributionI[];
  link?: LinkI[];
  meta?: MetaI[];
  extension?: ExtensionI;
  track?: TrackI[];
}

export interface JspfI {
  playlist?:Record<string, any>
}
