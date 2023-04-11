import {Validator, ValidatorResult} from 'jsonschema';

export interface BaseDataI{
  //toJSON():object;
}

export interface AttributionDataI extends BaseDataI {
  [key: string]: string;
}

export interface LinkDataI extends BaseDataI {
  [key: string]: string;
}

export interface MetaDataI extends BaseDataI {
  [key: string]: string;
}

export interface ExtensionDataI extends BaseDataI {
  [key: string]: any[];
}

export interface TrackDataI extends BaseDataI {
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
  link?: LinkDataI[];
  meta?: MetaDataI[];
  extension?: ExtensionDataI;
}

export interface PlaylistDataI extends BaseDataI {
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
}

export interface JSPFDataI extends BaseDataI {
  playlist?:Record<string, any>
}
