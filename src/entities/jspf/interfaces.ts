import {Validator, ValidatorResult} from 'jsonschema';

export interface JspfBaseI{
  //toJSON():object;
}

export interface JspfAttributionI extends JspfBaseI {
  [key: string]: string;
}

export interface JspfLinkI extends JspfBaseI {
  [key: string]: string;
}

export interface JspfMetaI extends JspfBaseI {
  [key: string]: string;
}

export interface JspfExtensionI extends JspfBaseI {
  [key: string]: any[];
}

export interface JspfTrackI extends JspfBaseI {
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

export interface JspfPlaylistI extends JspfBaseI {
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

export interface JspfObjectI extends JspfBaseI {
  playlist?:Record<string, any>
}
