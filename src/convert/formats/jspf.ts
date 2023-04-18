import { classToPlain } from 'class-transformer';
import { PlaylistI } from '../../entities/interfaces';
import { Jspf,Playlist } from '../../entities/models';
import { DataConverter } from '../models';

export default class JspfConverter extends DataConverter {
  public static readonly types = ['jspf'];

  public get(data:string):PlaylistI{
    /*
    try{
      data = JSON.parse(data);
    }catch(e){
      console.error('Unable to parse JSON.');
      throw e;
    }
    */

    const dto:Object = {}

    const jspf = new Jspf(dto);
    const json = jspf.toJSON();
    return json.playlist;
  }

  public set(playlistData: PlaylistI):string{
    const jspf = new Jspf();
    jspf.playlist = new Playlist(playlistData);
    return jspf.toString();
  }
}
