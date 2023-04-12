import {PlaylistDataI} from '../entities/jspf/interfaces';

export interface DataConverterI{
  get(data: string):PlaylistDataI;
  set(data: PlaylistDataI):string;
}

export interface ConvertOptionsI {
  ignoreValidationErrors?: boolean;
  stripInvalid?: boolean;
}
