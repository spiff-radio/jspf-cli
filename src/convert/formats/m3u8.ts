import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
import parseM3U8 from './m3u8-parser';
import serializeM3U8 from './m3u8-serializer';

export default class M3u8Converter extends DataConverter {
  public static readonly types = ['m3u','m3u8'];

  public get(input:string):JspfPlaylistI{
    return parseM3U8(input);
  }

  public set(dto: JspfPlaylistI):string{
    return serializeM3U8(dto);
  }

}
