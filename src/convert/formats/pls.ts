import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/jspf/interfaces';
import parsePLS from './pls-parser';
import serializePLS from './pls-serializer';

export default class PlsConverter extends DataConverter {
  public static readonly types = ['pls'];

  public get(input:string):JspfPlaylistI{
    return parsePLS(input);
  }

  public set(dto: JspfPlaylistI):string{
    return serializePLS(dto);
  }

}
