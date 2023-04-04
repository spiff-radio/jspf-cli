export interface AttributionInterface {
  [key: string]: string;
}

export interface LinkInterface {
  [key: string]: string;
}

export interface MetaInterface {
  [key: string]: string;
}

export interface ExtensionInterface {
  [key: string]: string[];
}

export interface TrackInterface {
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
  link?: LinkInterface[];
  meta?: MetaInterface[];
  extension?: ExtensionInterface;
}

export interface PlaylistInterface {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: AttributionInterface[];
  link?: LinkInterface[];
  meta?: MetaInterface[];
  extension?: ExtensionInterface;
  track?: TrackInterface[];
}
