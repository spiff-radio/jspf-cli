import { classToPlain } from 'class-transformer';

import { JspfPlaylistI } from '../../entities/interfaces';
import { Jspf, JspfPlaylist } from '../../entities/models';
import { DataConverter } from '../models';

export default class JspfConverter extends DataConverter {
  public static readonly type = 'jspf';
  public static readonly contentType = 'application/jspf+json;charset=utf-8';

  public get(data:string):JspfPlaylistI{

    try{
      data = JSON.parse(data);
    }catch(e){
      console.error('Unable to parse JSON.');
      throw e;
    }

    const jspf = new Jspf(data);
    const json = jspf.toJSON();

    return json.playlist;
  }

  public set(playlistData: JspfPlaylistI):string{
    const jspf = new Jspf();
    jspf.playlist = new JspfPlaylist(playlistData);
    return jspf.toString();
  }
}
