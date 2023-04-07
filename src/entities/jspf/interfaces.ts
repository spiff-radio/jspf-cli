import {Validator, ValidatorResult} from 'jsonschema';

export interface AttributionDataI {
  [key: string]: string;
}

export interface LinkDataI {
  [key: string]: string;
}

export interface MetaDataI {
  [key: string]: string;
}

export interface ExtensionDataI {
  [key: string]: string[];
}

export interface TrackDataI {
  location: string[];
  identifier: string[];
  title: string;
  creator: string;
  annotation: string;
  info: string;
  image: string;
  album: string;
  trackNum: number;
  duration: number;
  link: LinkDataI[];
  meta: MetaDataI[];
  extension: ExtensionDataI;
}

export interface PlaylistDataI {
  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  attribution: AttributionDataI[];
  link: LinkDataI[];
  meta: MetaDataI[];
  extension: ExtensionDataI;
  track: TrackDataI[];
  validator:Validator;
  validation:ValidatorResult;
  is_valid():boolean;
  toJSON():object;
}

export interface JSPFDataI {
  playlist:Record<string, any>
}
