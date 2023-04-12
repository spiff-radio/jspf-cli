import {JspfPlaylistI} from '../entities/jspf/interfaces';

export interface DataConverterI{
  get(data: string):JspfPlaylistI;
  set(data: JspfPlaylistI):string;
}

export interface ConvertOptionsI {
  ignoreValidationErrors?: boolean;
  stripInvalid?: boolean;
}
