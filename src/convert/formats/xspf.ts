import { DataConverter } from '../models';
import { PlaylistDataI } from '../../entities/jspf/interfaces';
import parseXSPF from './xspf-parser';
import serializeXSPF from './xspf-serializer';

export default class XspfConverter extends DataConverter {
  public static readonly types = ['xspf'];

  public get(data:any):PlaylistDataI{
    return parseXSPF(data);
  }

  public set(data:PlaylistDataI):string{
    return serializeXSPF(data);

  }
}
