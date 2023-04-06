import { PlaylistDataI, DataConverterI } from '../interfaces';
import { DataConverter,JSPFData,PlaylistData } from '../models';
import { classToPlain } from 'class-transformer';

export default class JspfConverter extends DataConverter {
  public static readonly types = ['jspf'];

  public get(data:string):PlaylistDataI{
    try{
      const jspfData = JSON.parse(data);
      const jspf = new JSPFData(jspfData);
      return jspf.toJSON();
    }catch(e){
      console.error('Unable to parse JSON.');
      throw e;
    }
  }

  public set(dto_data: PlaylistDataI):string{
    const dto_playlist = new PlaylistData(dto_data);
    return dto_playlist.toString();
  }


}
