import { DTOPlaylistI, DTOConverterI } from '../interfaces';
import { DTOConverter,DTOPlaylist } from '../models';
import { classToPlain } from 'class-transformer';

export default class JspfConverter extends DTOConverter {
  public static readonly types = ['jspf'];

  public get(data:string):DTOPlaylistI{
    try{
      return JSON.parse(data);
    }catch(e){
      console.error('Unable to parse JSON.');
      throw e;
    }
  }

  public set(dto_data: DTOPlaylistI):string{
    const dto_playlist = new DTOPlaylist(dto_data);
    return dto_playlist.toString();
  }


}
