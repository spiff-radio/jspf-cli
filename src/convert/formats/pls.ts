import { DataConverter } from '../models';
import { PlaylistDataI } from '../../entities/jspf/interfaces';
import parsePLS from './pls-parser';
import serializePLS from './pls-serializer';

export default class PlsConverter extends DataConverter {
  public static readonly types = ['pls'];

  public get(input:string):PlaylistDataI{
    return parsePLS(input);
  }

  public set(dto: PlaylistDataI):string{
    return serializePLS(dto);
  }

}
