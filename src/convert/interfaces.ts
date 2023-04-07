import {PlaylistDataI} from '../entities/jspf/interfaces';

export interface DataConverterI{
  set(data: PlaylistDataI):string,
  get(data: PlaylistDataI):PlaylistDataI
}

export interface ConvertOptionsI {
  format_in: string;
  format_out: string;
}
