import { DataConverter } from '../models';
import { PlaylistI } from '../../entities/interfaces';
import parseXSPF from './xspf-parser';
import serializeXSPF from './xspf-serializer';

export default class XspfConverter extends DataConverter {
  public static readonly types = ['xspf'];

  public get(data:string):PlaylistI{
    return parseXSPF(data);
  }

  public set(data:PlaylistI):string{
    return serializeXSPF(data);

  }
}
