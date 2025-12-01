import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
export default class M3uConverter extends DataConverter {
    static readonly format = "m3u";
    static readonly contentType = "audio/mpegurl";
    get(input: string): JspfPlaylistI;
    set(dto: JspfPlaylistI): string;
}
