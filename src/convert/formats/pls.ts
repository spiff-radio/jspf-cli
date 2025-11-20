import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
import parsePLS from './pls-parser';
import serializePLS from './pls-serializer';

export default class PlsConverter extends DataConverter {
  public static readonly type = 'pls';
  public static readonly contentType = 'audio/x-scpls';

  public get(input:string):JspfPlaylistI{
    return parsePLS(input);
  }

  public set(dto: JspfPlaylistI):string{
    return serializePLS(dto);
  }

}
