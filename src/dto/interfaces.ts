export interface DTOAttributionI {
  [key: string]: string;
}

export interface DTOLinkI {
  [key: string]: string;
}

export interface DTOMetaI {
  [key: string]: string;
}

export interface DTOExtensionI {
  [key: string]: string[];
}

export interface DTOTrackI {
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
  link?: DTOLinkI[];
  meta?: DTOMetaI[];
  extension?: DTOExtensionI;
}

export interface DTOPlaylistI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: DTOAttributionI[];
  link?: DTOLinkI[];
  meta?: DTOMetaI[];
  extension?: DTOExtensionI;
  track?: DTOTrackI[];
}
