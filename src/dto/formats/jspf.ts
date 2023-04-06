import { DTOPlaylistI, DTOConverterI } from '../interfaces';
import { DTOConverter,DTOJspf,DTOPlaylist } from '../models';
import { classToPlain } from 'class-transformer';

export default class JspfConverter extends DTOConverter {
  public static readonly types = ['jspf'];

  public get(data:string):DTOPlaylistI{
    try{
      const jspfData = JSON.parse(data);
      const jspf = new DTOJspf(jspfData);
      return jspf.toJSON();
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
