import { DataConverter } from '../models';
import { PlaylistDataI } from '../../entities/jspf/interfaces';
import parseM3U8 from './m3u8-parser';
import serializeM3U8 from './m3u8-serializer';

export default class M3u8Converter extends DataConverter {
  public static readonly types = ['m3u8'];

  public get(input:string):PlaylistDataI{
    return parseM3U8(input);
  }

  public set(dto: PlaylistDataI):string{
    return serializeM3U8(dto);
  }

}
