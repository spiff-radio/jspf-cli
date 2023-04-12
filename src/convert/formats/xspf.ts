import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/jspf/interfaces';
import parseXSPF from './xspf-parser';
import serializeXSPF from './xspf-serializer';

export default class XspfConverter extends DataConverter {
  public static readonly types = ['xspf'];

  public get(data:string):JspfPlaylistI{
    return parseXSPF(data);
  }

  public set(data:JspfPlaylistI):string{
    return serializeXSPF(data);

  }
}
