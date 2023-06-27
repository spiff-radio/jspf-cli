import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
export default class M3u8Converter extends DataConverter {
    static readonly type = "m3u8";
    static readonly contentType = "application/vnd.apple.mpegurl";
    get(input: string): JspfPlaylistI;
    set(dto: JspfPlaylistI): string;
}
