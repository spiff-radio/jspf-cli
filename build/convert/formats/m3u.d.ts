import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
export default class M3uConverter extends DataConverter {
    static readonly type = "m3u";
    static readonly contentType = "audio/mpegurl";
    get(input: string): JspfPlaylistI;
    set(dto: JspfPlaylistI): string;
}
