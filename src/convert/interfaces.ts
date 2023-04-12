import {PlaylistDataI} from '../entities/jspf/interfaces';

export interface DataConverterI{
  set(data: PlaylistDataI):string,
  get(data: PlaylistDataI):PlaylistDataI
}

export interface ConvertOptionsI {
  ignoreValidationErrors?: boolean;
  stripInvalid?: boolean;
}
