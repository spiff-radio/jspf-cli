import {PlaylistI} from '../entities/interfaces';

export interface DataConverterI{
  get(data: string):PlaylistI;
  set(data: PlaylistI):string;
}

export interface ConvertOptionsI {
  ignoreValidationErrors?: boolean;
  stripInvalid?: boolean;
}
