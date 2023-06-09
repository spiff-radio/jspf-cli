import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
import parseM3U8 from './m3u8-parser';
import serializeM3U8 from './m3u8-serializer';

export default class M3u8Converter extends DataConverter {
  public static readonly type = 'm3u8';
  public static readonly contentType = 'application/vnd.apple.mpegurl';

  public get(input:string):JspfPlaylistI{
    return parseM3U8(input);
  }

  public set(dto: JspfPlaylistI):string{
    return serializeM3U8(dto);
  }

}
