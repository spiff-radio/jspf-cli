import { classToPlain } from 'class-transformer';
import { PlaylistDataI } from '../../entities/jspf/interfaces';
import { Jspf,Playlist } from '../../entities/models';
import { DataConverter } from '../models';

export default class JspfConverter extends DataConverter {
  public static readonly types = ['jspf'];

  public get(data:string):PlaylistDataI{
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

  public set(playlistData: PlaylistDataI):string{
    const jspf = new Jspf();
    jspf.playlist = new Playlist(playlistData);
    return jspf.toString();
  }
}
