import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
import parseXSPF from './xspf-parser';
import serializeXSPF from './xspf-serializer';

export default class XspfConverter extends DataConverter {
  public static readonly type = 'xspf';
  public static readonly contentType = 'application/xspf+xml;charset=utf-8';

  public get(data:string):JspfPlaylistI{
    return parseXSPF(data);
  }

  public set(data:JspfPlaylistI):string{
    return serializeXSPF(data);

  }
}
