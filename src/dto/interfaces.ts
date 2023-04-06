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

export interface PlaylistDataI {
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

export interface JSPFDataI {
  playlist:Record<string, any>
}

export interface DataConverterI{
  set(data: PlaylistDataI):string,
  get(data: PlaylistDataI):PlaylistDataI
}

export interface ConvertOptionsI {
  format_in: string;
  format_out: string;
}
