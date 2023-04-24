import {Validator, ValidatorResult} from 'jsonschema';

export interface BaseI{
  //toJSON():object;
}

export interface AttributionI extends BaseI {
  [key: string]: string;
}

export interface LinkI extends BaseI {
  [key: string]: string;
}

export interface MetaI extends BaseI {
  [key: string]: string;
}

export interface ExtensionI extends BaseI {
  [key: string]: any[];
}

export interface TrackI extends BaseI {
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

export interface PlaylistI extends BaseI {
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

export interface JspfI extends BaseI {
  playlist?:Record<string, any>
}
